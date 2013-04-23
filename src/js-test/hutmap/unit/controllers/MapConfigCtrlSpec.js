describe('MapConfigCtrl', function() {
  var hutmapScope, hutScope, mapScope, mapConfigScope;
  var markerOptions;

  beforeEach(function() {
    module('hutmap');
  });

  beforeEach(inject(function($controller, $httpBackend, $rootScope, _markerOptions_) {
    $httpBackend.whenGET(/.*/).respond('');
    markerOptions = _markerOptions_;

    hutmapScope = $rootScope.$new();
    var hutmapCtrl = $controller('HutmapCtrl', {$scope: hutmapScope});
    hutScope = hutmapScope.$new();
    var hutCtrl = $controller('HutCtrl', {$scope: hutScope});
    var filterScope = hutScope.$new();
    var filterCtrl = $controller('FilterCtrl', {$scope: filterScope});
    mapScope = filterScope.$new();
    var mapCtrl = $controller('MapCtrl', {$scope: mapScope});
    mapConfigScope = mapScope.$new();
    var mapConfigCtrl = $controller('MapConfigCtrl', {$scope: mapConfigScope});

  }));

  describe('selectHut', function() {
    var hut, mockMarker;

    beforeEach(function() {
      mockMarker = {
        setOptions: jasmine.createSpy(),
        getIcon: jasmine.createSpy().andReturn('1')
      };

      hut = {id:1,agency:1,region:1};
      mapConfigScope.selectHut(mockMarker, hut);
      mapConfigScope.$digest();
    });

    it('sets the selectedHut', function() {
      expect(hutScope.selectedHut).toEqual(hut);
    });

    it('sets the marker icon', function() {
      expect(mockMarker.setOptions).toHaveBeenCalledWith(markerOptions.selected);
    });

    it('re-sets the previously selected marker icon', function() {
      hut.id = 2;
      mapConfigScope.selectHut(mockMarker, hut);
      mapConfigScope.$digest();
      expect(mockMarker.setOptions.calls[1].args[0].icon).toEqual('1');
    });
  });
});
