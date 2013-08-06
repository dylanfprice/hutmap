describe('MapCtrl', function() {
  var $rootScope, $httpBackend, $location;
  var hutmapScope, hutScope, mapScope;

  beforeEach(function() {
    module('hutmap');
  });

  beforeEach(inject(function(_$rootScope_, _$httpBackend_, _$location_, $controller) {
    $rootScope = _$rootScope_;
    $location = _$location_;
    $httpBackend = _$httpBackend_;

    $httpBackend.whenGET(/.*/).respond('');

    $location.search({
      m_center: '1,2',
      m_zoom: 3,
    });

    hutmapScope = $rootScope.$new();
    var hutmapCtrl = $controller('HutmapCtrl', {$scope: hutmapScope});
    hutScope = hutmapScope.$new();
    var hutCtrl = $controller('HutCtrl', {$scope: hutScope});
    var filterScope = hutScope.$new();
    var filterCtrl = $controller('FilterCtrl', {$scope: filterScope});
    mapScope = filterScope.$new();
    var mapCtrl = $controller('MapCtrl', {$scope: mapScope});
  }));

  it('waits for scope initialization', function() {
    $rootScope.$apply();

    expect(mapScope.center).toBeUndefined();
    expect(mapScope.zoom).toBeUndefined();
    expect(mapScope.hutMarkerEvents).toBeUndefined();
  });

  it('updates center and zoom from $location', function() {
    mapScope.center = new google.maps.LatLng(6,7);
    mapScope.zoom = 8;

    $rootScope.$apply();

    expect(mapScope.center).toEqual(new google.maps.LatLng(1,2));
    expect(mapScope.zoom).toEqual(3);
    expect(mapScope.hutMarkerEvents).toBeUndefined();
  });

  it('clicks selectedHut on clickSelected', function() {
    mapScope.center = new google.maps.LatLng(6,7);
    mapScope.zoom = 8;

    hutScope.huts = [{id:1}];
    hutScope.setSelectedHut({
      id:1,
      location: {
        coordinates: [5, 4]
      },
      agency:1,
      region:1
    });
    hutScope.$broadcast('clickSelected');

    $rootScope.$apply();

    expect(mapScope.hutMarkerEvents).toEqual([{
      event: 'click',
      locations: [new google.maps.LatLng(4,5)],
    }]);
  });
  
  it('clicks selectedHut when markers change', function() {
    var called = 0;
    mapScope.$watch('hutMarkerEvents', function(hutMarkerEvents) {
      called++;
    });

    var child = mapScope.$new();
    child.$emit('gmMarkersUpdated', 'huts');
    $rootScope.$apply();

    expect(called).toEqual(1);
  });

  describe('updates $location', function() {

    beforeEach(function() {
      mapScope.center = new google.maps.LatLng(6,7);
      mapScope.zoom = 8;
      hutScope.huts = [{id:1,agency:1,region:1}];
      $rootScope.$apply();
    });

    it('from center', function() {
      mapScope.center = new google.maps.LatLng(9,10);
      mapScope.$digest();
      expect($location.search().m_center).toEqual('9,10');
    });

    it('from zoom', function() {
      mapScope.zoom = 11;
      mapScope.$digest();
      expect($location.search().m_zoom).toEqual(11);
    });

  });

});
