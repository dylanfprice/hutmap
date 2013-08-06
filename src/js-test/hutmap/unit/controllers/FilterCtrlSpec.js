describe('FilterCtrl', function() {
  var $rootScope, $timeout;
  var hutmapScope, hutScope, filterScope;

  beforeEach(function() {
    module('hutmap');
  });

  beforeEach(inject(function($controller, $httpBackend, _$rootScope_, _$timeout_, _$location_) {
    $httpBackend.whenGET(/.*/).respond('');
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    $location = _$location_;

    hutmapScope = $rootScope.$new();
    var hutmapCtrl = $controller('HutmapCtrl', {$scope: hutmapScope});
    hutScope = hutmapScope.$new();
    var hutCtrl = $controller('HutCtrl', {$scope: hutScope});
    filterScope = hutScope.$new();
    var filterCtrl = $controller('FilterCtrl', {$scope: filterScope});

    hutScope.huts = []
    var huts = hutmap.fixtures.hutdata().huts.object_index;
    angular.forEach(['1', '2', '3'], function(id) {
      hutScope.huts.push(huts[id]);
    });
  }));

  describe('$location', function() {

    it('updates $scope', inject(function($controller, $timeout) {
      $timeout.flush();
      var f = $location.search().f;
      expect(f).toMatch(/winter%22%3Atrue/);
      f = f.replace('winter%22%3Atrue', 'winter%22%3Afalse');

      $location.search('f', f);

      filterScope = hutScope.$new();
      filterScope.f = {};
      $controller('FilterCtrl', {$scope: filterScope});

      expect(filterScope.f.season.winter).toBeFalsy();
      expect(filterScope.f.shelterType[0].$keywords).toBeDefined();
    }));

    it('is updated from $scope', inject(function($timeout) {
      $location.search('f', null);
      filterScope.f.value = 'myexpectedstring';

      filterScope.filter();
      $timeout.flush();

      expect($location.search().f).toMatch(/.*myexpectedstring.*/);
    }));

  });

  function setSeason(winter, summer, unknown) {
    filterScope.f.season.winter = winter;
    filterScope.f.season.summer = summer;
    filterScope.f.season.unknown = unknown;
  }

  function findShelterType(typeName) {
    var found;
    angular.forEach(filterScope.f.shelterType, function(type) {
      if (type.name === typeName) {
        found = type;
      }
    });
    return found;
  }

  function setShelterType(emergencyShelter, fireLookouts, hutsAndYurts, compounds) {
    filterScope.f.anyShelterType = false;
    findShelterType('emergency shelters').include = emergencyShelter;
    findShelterType('fire lookouts').include = fireLookouts;
    findShelterType('huts & yurts').include = hutsAndYurts;
    findShelterType('compounds').include = compounds;
  }

  function filter() {
    filterScope.filter();
    $rootScope.$apply();
    $timeout.flush();
  }

  describe('filter by season', function() {

    it('winter', function() {
      setSeason(true, false, false);
      setShelterType(true, true, true, true);
      filter();
      expect(hutScope.filteredHutIds[1]).toBeDefined();
      expect(hutScope.filteredHutIds[2]).toBeUndefined();
      expect(hutScope.filteredHutIds[3]).toBeUndefined();
    });

    it('summer', function() {
      setSeason(false, true, false);
      setShelterType(true, true, true, true);
      filter();
      expect(hutScope.filteredHutIds[1]).toBeDefined();
      expect(hutScope.filteredHutIds[2]).toBeDefined();
      expect(hutScope.filteredHutIds[3]).toBeUndefined();
    });

    it('winter or summer', function() {
      setSeason(true, true, false);
      setShelterType(true, true, true, true);
      filter();
      expect(hutScope.filteredHutIds[1]).toBeDefined();
      expect(hutScope.filteredHutIds[2]).toBeDefined();
      expect(hutScope.filteredHutIds[3]).toBeUndefined();
    });

    it('winter or unknown', function() {
      setSeason(true, false, true);
      setShelterType(true, true, true, true);
      filter();
      expect(hutScope.filteredHutIds[1]).toBeDefined();
      expect(hutScope.filteredHutIds[2]).toBeUndefined();
      expect(hutScope.filteredHutIds[3]).toBeDefined();
    });

  });

  describe('filters by shelter type', function() {

    it('works with any shelter type', function() {
      setSeason(true, true, true);
      setShelterType(true, true, false, true);
      filterScope.f.anyShelterType = true;
      filterScope.$digest();
      filter();
      expect(hutScope.filteredHutIds[1]).toBeDefined();
      expect(hutScope.filteredHutIds[2]).toBeDefined();
      expect(hutScope.filteredHutIds[3]).toBeDefined();
    });

    it('works for a single shelter type', function() {
      setSeason(true, true, true);
      setShelterType(false, false, true, false);
      filter();
      expect(hutScope.filteredHutIds[1]).toBeDefined();
      expect(hutScope.filteredHutIds[2]).toBeUndefined();
      expect(hutScope.filteredHutIds[3]).toBeDefined();
    });

    it('is fine with multiple matches on same hut', function() {
      setSeason(true, true, true);
      setShelterType(true, false, true, false);
      filter();
      expect(hutScope.filteredHutIds[1]).toBeDefined();
      expect(hutScope.filteredHutIds[2]).toBeUndefined();
      expect(hutScope.filteredHutIds[3]).toBeDefined();
    });

    it('selecting any disables all shelter types', function() {
      setShelterType(true, true, true, true);
      filterScope.f.anyShelterType = true;
      filterScope.$digest();
      angular.forEach(filterScope.f.shelterType, function(data, type) {
        expect(data.include).toBeFalsy();
      });
    });

  });

});
