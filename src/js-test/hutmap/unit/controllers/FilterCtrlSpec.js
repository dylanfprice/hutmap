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
      expect(hutScope.filteredHuts[1]).toBeDefined();
      expect(hutScope.filteredHuts[2]).toBeUndefined();
    });

    it('summer OR summer and winter', function() {
      setSeason(false, true);
      setShelterType(true, true, true, true);
      filter();
      expect(hutScope.filteredHuts[1]).toBeDefined();
      expect(hutScope.filteredHuts[2]).toBeDefined();
    });

    it('winter OR summer OR winter AND summer', function() {
      setSeason(true, true);
      setShelterType(true, true, true, true);
      filter();
      expect(hutScope.filteredHuts[1]).toBeDefined();
      expect(hutScope.filteredHuts[2]).toBeDefined();
    });

  });

  describe('filters by shelter type', function() {

    it('works for a single shelter type', function() {
      setSeason(true, true);
      setShelterType(false, false, true, false);
      filter();
      expect(hutScope.filteredHuts[1]).toBeDefined();
      expect(hutScope.filteredHuts[2]).toBeUndefined();
    });

    it('is fine with multiple matches on same hut', function() {
      setSeason(true, true);
      setShelterType(true, false, true, false);
      filter();
      expect(hutScope.filteredHuts[1]).toBeDefined();
      expect(hutScope.filteredHuts[2]).toBeUndefined();
    });
  });

});
