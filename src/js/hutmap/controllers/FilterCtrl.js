'use strict';

(function () {
  angular.module('hutmap').

  controller('FilterCtrl', 
    ['$scope',
    function($scope) {

    // filter data binding

    $scope.season = {
      winter: true,
      summer: true,
    };

    $scope.shelterType = {
      'emergency shelters': {
        include: false,
        keywords: ['Emergency Shelter', 'Refuge']
      },
      'fire lookouts': {
        include: true,
        keywords: ['Fire Lookout']
      },
      'huts & yurts': {
        include: true,
        keywords: ['Hut', 'Yurt', 'Chickee', 'Lean-to', 'Wall Tent']
      },
      'compounds': {
        include: true,
        keywords: ['Compound', 'Hostel', 'Tea House', 'Lodge', 'Chalet', 'Ranch']
      }
    };

    // filter function

    $scope.filter = function() {
      $scope.incLoading();
      var filteredHuts = {};
      var typeKeywords = getTypeKeywords();
      angular.forEach($scope.huts, function(hut) {
        if (
          matchSeason(hut) &&
          matchShelterType(hut, typeKeywords)
        ) {
          filteredHuts[hut.id] = hut;
        }
      });
      $scope.setFilteredHuts(filteredHuts);
      $scope.$broadcast('gmMarkersRedraw', 'huts');
      $scope.decLoading();
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
      if (!season.winter && !season.summer) {
        return true;
      } else {
        return (season.winter && hut.open_winter) ||
               (season.summer && hut.open_summer);
      }
    };

    function matchShelterType(hut, keywords) {
      var matchShelterType = false;
      angular.forEach(keywords, function(keyword) {
        if (~hut.types.indexOf(keyword)) {
          matchShelterType = true;
          return;
        }
      });
      return matchShelterType;
    };

  }]);
})();