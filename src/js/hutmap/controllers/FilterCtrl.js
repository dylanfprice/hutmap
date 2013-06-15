'use strict';

(function () {
  angular.module('hutmap.controllers').

  controller('FilterCtrl', 
    ['$scope', '$timeout',
    function($scope, $timeout) {

    // filter data binding

    $scope.resetFilters = function() {

      $scope.season = {
        winter: true,
        summer: true,
        unknown: true,
      };

      $scope.anyShelterType = true;
      $scope.shelterType = {
        'emergency shelters': {
          include: false,
          keywords: ['Emergency Shelter', 'Refuge']
        },
        'fire lookouts': {
          include: false,
          keywords: ['Fire Lookout']
        },
        'huts & yurts': {
          include: false,
          keywords: ['Hut', 'Yurt', 'Chickee', 'Lean-to', 'Wall Tent', 'Shelter']
        },
        'compounds': {
          include: false,
          keywords: ['Compound', 'Hostel', 'Tea House', 'Lodge', 'Chalet', 'Ranch', 'Farm']
        }
      };

      $scope.filter();
    };

    $scope.setAnyShelterType = function(anyShelterType) {
      $scope.anyShelterType = anyShelterType;
    };

    $scope.$watch('anyShelterType', function(newValue, oldValue) {
      if (newValue) {
        angular.forEach($scope.shelterType, function(data, type) {
          data.include = false;
        });
      }
    });

   
    // filter function

    $scope.filter = function() {
      $scope.incLoading();
      $timeout(_filter).then(function() {
        $scope.decLoading();
      });
    };

    function _filter() {
      var filteredHuts = [];
      var filteredHutIds = [];
      var typeKeywords = getTypeKeywords();
      angular.forEach($scope.huts, function(hut) {
        if (
          matchSeason(hut) &&
          matchShelterType(hut, typeKeywords)
        ) {
          filteredHuts.push(hut);
          filteredHutIds[hut.id] = hut.id;
        }
      });
      $scope.setFilteredHuts(filteredHuts, filteredHutIds);
      $scope.$broadcast('gmMarkersRedraw', 'huts');
    };

    $scope.$watch('huts', function() {
      $scope.filter();
    });

    
    // filter function helpers
    
    function getTypeKeywords() {
      var keywords = [];
      angular.forEach($scope.shelterType, function(data, type) {
        if (data.include) {
          keywords = keywords.concat(data.keywords);
        }
      });
      return keywords;
    };


    // matchers
   
    function matchSeason(hut) {
      var season = $scope.season;
      return (season.summer && hut.open_summer) || 
             (season.winter && hut.open_winter) || 
             (season.unknown && (!hut.open_summer && !hut.open_winter));
    };

    function matchShelterType(hut, keywords) {
      var matchShelterType = false;
      if ($scope.anyShelterType) {
        matchShelterType = true;
      } else {
        angular.forEach(keywords, function(keyword) {
          if (~hut.types.indexOf(keyword)) {
            matchShelterType = true;
            return;
          }
        });
      }
      return matchShelterType;
    };

    $scope.resetFilters();
  }]);
})();
