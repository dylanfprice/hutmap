describe('HutCtrl', function() {
  var hutmapScope, hutScope;
  var $httpBackend;
  var $timeout;

  beforeEach(function() {
    module('hutmap');
  });

  beforeEach(inject(function(_$httpBackend_, _$timeout_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;
    $timeout = _$timeout_;
    $httpBackend.whenGET(/.*/).respond('');

    hutmapScope = $rootScope.$new();
    var hutmapCtrl = $controller('HutmapCtrl', {$scope: hutmapScope});
    hutScope = hutmapScope.$new();
    var hutCtrl = $controller('HutCtrl', {$scope: hutScope});
  }));

  var expectGET = function(num) {
    $httpBackend.expectGET('/huts/api/v1/hutsearch/?limit=' + num).
      respond({
        "meta": {
          "limit": num,
        },
        "objects": [
          { "id": num, },
        ]
      });
  };

  var setQuery = function(num) {
    hutScope.setQuery({
      limit: num,
    });
  };

  describe('single query', function() {

    beforeEach(function() {
      expectGET(1);
      setQuery(1);
    });

    it('works', function() {
      hutScope.$digest();
      $timeout.flush();
      $httpBackend.flush();

      expect(hutScope.huts[0].id).toEqual(1);
      expect(hutScope.hutsMeta.limit).toEqual(1);
    });

    it('sets loading', function() {
      expect(hutScope.loading).toBeFalsy();
      hutScope.$digest();
      $timeout.flush();
      expect(hutScope.loading).toBeTruthy();
      $httpBackend.flush();
      expect(hutScope.loading).toBeFalsy();
    });

  });

  describe('multiple queries', function() {

    it('only runs latest query', function() {
      expectGET(2);
      setQuery(1);

      hutScope.$digest();
      setQuery(2);

      hutScope.$digest();
      $timeout.flush();

      expect(hutScope.loading).toEqual(1);

      $httpBackend.flush();
      expect(hutScope.huts[0].id).toEqual(2);
    });

  });

});
