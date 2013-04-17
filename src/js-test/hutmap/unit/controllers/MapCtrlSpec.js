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
      m_selected: '4,5',
    });

    hutmapScope = $rootScope.$new();
    var hutmapCtrl = $controller('HutmapCtrl', {$scope: hutmapScope});
    hutScope = hutmapScope.$new();
    var hutCtrl = $controller('HutCtrl', {$scope: hutScope});
    mapScope = hutScope.$new();
    var mapCtrl = $controller('MapCtrl', {$scope: mapScope});
  }));

  it('waits for scope initialization', function() {
    $rootScope.$apply();

    expect(mapScope.center).toBeUndefined();
    expect(mapScope.zoom).toBeUndefined();
    expect(mapScope.hutMarkerEvent).toBeUndefined();
  });

  it('updates center and zoom from $location', function() {
    mapScope.center = new google.maps.LatLng(6,7);
    mapScope.zoom = 8;

    $rootScope.$apply();

    expect(mapScope.center).toEqual(new google.maps.LatLng(1,2));
    expect(mapScope.zoom).toEqual(3);
    expect(mapScope.hutMarkerEvent).toBeUndefined();
  });

  it('updates selectedHut from $location', function() {
    hutScope.huts = [{id:1}];

    $rootScope.$apply();

    expect(mapScope.center).toBeUndefined();
    expect(mapScope.zoom).toBeUndefined();
    expect(mapScope.hutMarkerEvent).toEqual({
      event: 'click',
      location: new google.maps.LatLng(4,5),
    });
  });
  
  describe('updates $location', function() {

    beforeEach(function() {
      mapScope.center = new google.maps.LatLng(6,7);
      mapScope.zoom = 8;
      hutScope.huts = [{id:1}];
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

    it('from selectedHut', function() {
      mapScope.setSelectedHut({id:2,location:{type: 'Point', coordinates: [13, 12]}});
      mapScope.$digest();
      expect($location.search().m_selected).toEqual('12,13');
    });

  });
});
