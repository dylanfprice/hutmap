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
      {id: 2, open_summer: true, open_winter: false, types: ['Hostel']}
    ];
  }));

  function setSeason(winter, summer) {
    filterScope.season.winter = winter;
    filterScope.season.summer = summer;
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

    it('winter OR winter and summer', function() {
      setSeason(true, false);
      setShelterType(true, true, true, true);
      filter();
      expect(hutScope.filteredHutIds[1]).toBeDefined();
      expect(hutScope.filteredHutIds[2]).toBeUndefined();
    });

    it('summer OR summer and winter', function() {
      setSeason(false, true);
      setShelterType(true, true, true, true);
      filter();
      expect(hutScope.filteredHutIds[1]).toBeDefined();
      expect(hutScope.filteredHutIds[2]).toBeDefined();
    });

    it('winter OR summer OR winter AND summer', function() {
      setSeason(true, true);
      setShelterType(true, true, true, true);
      filter();
      expect(hutScope.filteredHutIds[1]).toBeDefined();
      expect(hutScope.filteredHutIds[2]).toBeDefined();
    });

  });

  describe('filters by shelter type', function() {

    it('works with any shelter type', function() {
      setSeason(false, false);
      setShelterType(true, true, false, true);
      filterScope.setAnyShelterType(true);
      filterScope.$digest();
      filter();
      expect(hutScope.filteredHutIds[1]).toBeDefined();
      expect(hutScope.filteredHutIds[2]).toBeDefined();
    });

    it('works for a single shelter type', function() {
      setSeason(false, false);
      setShelterType(false, false, true, false);
      filter();
      expect(hutScope.filteredHutIds[1]).toBeDefined();
      expect(hutScope.filteredHutIds[2]).toBeUndefined();
    });

    it('is fine with multiple matches on same hut', function() {
      setSeason(false, false);
      setShelterType(true, false, true, false);
      filter();
      expect(hutScope.filteredHutIds[1]).toBeDefined();
      expect(hutScope.filteredHutIds[2]).toBeUndefined();
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
