'use strict';

(function () {
  angular.module('hutmap.controllers').

  controller('FilterCtrl', 
    ['$scope', '$timeout', '$location',
    function($scope, $timeout, $location) {
 
    // update browser url from scope
    var updateLocation = function() {
      if ($scope.f) {
        $location.search('f', encodeURIComponent(angular.toJson($scope.f)));
      }
    };

    // update scope from browser url
    var updateScope = function() {
      var f = $location.search().f;
      $location.search('f', null);
      if (f != null) {
        $scope.f = angular.fromJson(decodeURIComponent(f));
      }
      $scope.filter();
    };


    // filter data binding

    $scope.resetFilters = function() {

      $scope.f = {};

      $scope.f.season = {
        winter: true,
        summer: true,
        unknown: true,
      };

      $scope.f.anyShelterType = true;
      $scope.f.shelterType = {
        'emergency shelters': {
          include: false,
          $keywords: ['Emergency Shelter', 'Refuge']
        },
        'fire lookouts': {
          include: false,
          $keywords: ['Fire Lookout']
        },
        'huts & yurts': {
          include: false,
          $keywords: ['Hut', 'Yurt', 'Chickee', 'Lean-to', 'Wall Tent', 'Shelter']
        },
        'compounds': {
          include: false,
          $keywords: ['Compound', 'Hostel', 'Tea House', 'Lodge', 'Chalet', 'Ranch', 'Farm']
        }
      };

      $scope.filter();
    };

    $scope.setAnyShelterType = function(anyShelterType) {
      $scope.f.anyShelterType = anyShelterType;
    };

    $scope.$watch('f.anyShelterType', function(newValue, oldValue) {
      if (newValue) {
        angular.forEach($scope.f.shelterType, function(data, type) {
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
      updateLocation();
    };

    $scope.$watch('huts', function() {
      $scope.filter();
    });

    
    // filter function helpers
    
    function getTypeKeywords() {
      var keywords = [];
      angular.forEach($scope.f.shelterType, function(data, type) {
        if (data.include) {
          keywords = keywords.concat(data.$keywords);
        }
      });
      return keywords;
    };


    // matchers
   
    function matchSeason(hut) {
      var season = $scope.f.season;
      return (season.summer && hut.open_summer) || 
             (season.winter && hut.open_winter) || 
             (season.unknown && (!hut.open_summer && !hut.open_winter));
    };

    function matchShelterType(hut, keywords) {
      var matchShelterType = false;
      if ($scope.f.anyShelterType) {
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

    // initialize filters
    $scope.resetFilters();
    // we update scope from browser url once, at beginning
    updateScope();

  }]);
})();
