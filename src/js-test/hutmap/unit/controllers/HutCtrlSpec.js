describe('HutCtrl', function() {
  var $rootScope, hutmapScope, hutScope;
  var Huts;
  var $timeout, $location;

  beforeEach(function() {
    module('hutmap');
  });

  beforeEach(function() {
    Huts = {};
    Huts.totalHutCount = jasmine.createSpy();
    Huts.query = jasmine.createSpy();
    Huts.hut = jasmine.createSpy();
    Huts.agency = jasmine.createSpy();
    Huts.region = jasmine.createSpy();

    module(function($provide) {
      $provide.value('Huts', Huts);
    });
    
    inject(function($q) {
      Huts.totalHutCount.andCallFake(function() {
        var deferred = $q.defer();
        deferred.resolve(2);
        return deferred.promise; 
      });
      Huts.query.andCallFake(function(params) {
        var deferred = $q.defer();
        var huts = [];
        huts.push({id:1,agency:1,region:1});
        if (params.limit === 0 || params.limit === 2) {
          huts.push({id:2,agency:2,region:2});
        }
        deferred.resolve(huts);
        return deferred.promise; 
      });
      Huts.hut.andCallFake(function() {
        var deferred = $q.defer();
        deferred.resolve({id:1,agency:1,region:1});
        return deferred.promise;
      });
      Huts.agency.andCallFake(function() {
        var deferred = $q.defer();
        deferred.resolve({id: 1, name: 'agency'});
        return deferred.promise; 
      });
      Huts.region.andCallFake(function() {
        var deferred = $q.defer();
        deferred.resolve({id: 1, name: 'region'});
        return deferred.promise; 
      });
    });

    inject(function($httpBackend) {
      $httpBackend.whenGET(/.*/).respond('');
    });
  });

  beforeEach(inject(function(_$timeout_, _$rootScope_, _$location_, $controller) {
    $timeout = _$timeout_;
    $rootScope = _$rootScope_;
    $location = _$location_;

    $location.search('h_selected', 1);

    hutmapScope = $rootScope.$new();
    var hutmapCtrl = $controller('HutmapCtrl', {$scope: hutmapScope});
    hutScope = hutmapScope.$new();
    var hutCtrl = $controller('HutCtrl', {$scope: hutScope});
  }));

  var setQuery = function(num) {
    hutScope.setQuery({
      limit: num,
    });
  };

  describe('single query', function() {

    beforeEach(function() {
      setQuery(1);
    });

    it('works', function() {
      hutScope.$digest();
      $timeout.flush();

      expect(hutScope.huts[0].id).toEqual(1);
    });

  });

  describe('multiple queries', function() {

    it('only runs latest query', function() {
      setQuery(1);

      hutScope.$digest();
      setQuery(2);

      hutScope.$digest();
      $timeout.flush();

      expect(hutScope.huts.length).toEqual(2);
      expect(Huts.query.calls.length).toEqual(1);
    });

  });

  describe('setSelectedHut', function() {
    beforeEach(function() {
      setQuery(1);
      hutScope.$digest();
      $timeout.flush();
      hutScope.setSelectedHut(hutScope.huts[0]);
      $rootScope.$apply();
    });

    it('retrieves the agency', function() {
      expect(hutScope.selectedHutAgency.name).toEqual('agency'); 
    });

    it('retrieves the region', function() {
      expect(hutScope.selectedHutRegion.name).toEqual('region'); 
    });
  });

  describe('$location', function() {

    beforeEach(function() {
      $rootScope.$apply();
    });
      
    it('is read for selectedHut', function() {
      expect(hutScope.selectedHut.id).toEqual(1);
    });

    it('is updated with selectedHut', function() {
      setQuery(2);
      hutScope.$digest();
      $timeout.flush();
      hutScope.setSelectedHut(hutScope.huts[1]);
      $rootScope.$apply();
      expect($location.search().h_selected).toEqual(2);
    });
  });

});
