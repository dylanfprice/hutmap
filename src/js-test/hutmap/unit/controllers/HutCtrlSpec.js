describe('HutCtrl', function() {
  var hutmapScope, hutScope;
  var $httpBackend;

  beforeEach(function() {
    module('hutmap');
  });

  beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;
    $httpBackend.whenGET(/.*/).respond('');

    hutmapScope = $rootScope.$new();
    var hutmapCtrl = $controller('HutmapCtrl', {$scope: hutmapScope});
    hutScope = hutmapScope.$new();
    var hutCtrl = $controller('HutCtrl', {$scope: hutScope});
  }));

  it('sets query from $location', inject(function($location, $controller) {
    $location.search({h_key: 'value'});
    hutScope = hutmapScope.$new();
    $controller('HutCtrl', {$scope: hutScope});

    expect(hutScope.query).toEqual({key: 'value'});
  }));

  it('sets $location from query', inject(function($location) {
    hutScope.setQuery({
      key: 'value',
    });

    hutScope.$digest();

    expect($location.search().h_key).toEqual('value');
  }));

  describe('queries for huts', function() {

    beforeEach(function() {
      $httpBackend.expectGET('/huts/api/v1/hut?limit=1').
        respond({
          "meta": {
            "limit": 1,
          },
          "objects": [
            { "id": 1, },
          ]
        });

      hutScope.setQuery({
        limit: 1,
      });
    });

    it('correctly', function() {
      hutScope.$digest();
      $httpBackend.flush();

      expect(hutScope.huts[0].id).toEqual(1);
      expect(hutScope.hutsMeta.limit).toEqual(1);
    });

    it('and sets loading', function() {
      expect(hutScope.loading).toBeFalsy();
      hutScope.$digest();
      expect(hutScope.loading).toBeTruthy();
      $httpBackend.flush();
      expect(hutScope.loading).toBeFalsy();
    });

  });
});
