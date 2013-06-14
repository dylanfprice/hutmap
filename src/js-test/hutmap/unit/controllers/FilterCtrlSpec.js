describe('FilterCtrl', function() {
  var $rootScope, $timeout;
  var hutmapScope, hutScope, filterScope;

  beforeEach(function() {
    module('hutmap');
  });

  beforeEach(inject(function($controller, $httpBackend, _$rootScope_, _$timeout_) {
    $httpBackend.whenGET(/.*/).respond('');
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;

    hutmapScope = $rootScope.$new();
    var hutmapCtrl = $controller('HutmapCtrl', {$scope: hutmapScope});
    hutScope = hutmapScope.$new();
    var hutCtrl = $controller('HutCtrl', {$scope: hutScope});
    filterScope = hutScope.$new();
    var filterCtrl = $controller('FilterCtrl', {$scope: filterScope});

    hutScope.huts = [
      {id: 1, open_summer: true, open_winter: true, types: ['Yurt', 'Emergency Shelter']},
      {id: 2, open_summer: true, open_winter: false, types: ['Hostel']},
      {id: 3, open_summer: null, open_winter: null, types: ['Hut']}
    ];
  }));

  function setSeason(winter, summer, unknown) {
    filterScope.season.winter = winter;
    filterScope.season.summer = summer;
    filterScope.season.unknown = unknown;
  }

  function setShelterType(emergencyShelter, fireLookouts, hutsAndYurts, compounds) {
    filterScope.setAnyShelterType(false);
    filterScope.shelterType['emergency shelters'].include = emergencyShelter;
    filterScope.shelterType['fire lookouts'].include = fireLookouts;
    filterScope.shelterType['huts & yurts'].include = hutsAndYurts;
    filterScope.shelterType['compounds'].include = compounds;
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
      filterScope.setAnyShelterType(true);
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
      filterScope.setAnyShelterType(true);
      filterScope.$digest();
      angular.forEach(filterScope.shelterType, function(data, type) {
        expect(data.include).toBeFalsy();
      });
    });

  });

});
