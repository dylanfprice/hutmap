'use strict';

(function () {
  angular.module('hutmap').

  controller('HutCtrl', 
    ['$scope', '$location', '$timeout', 'Huts', 'HutDB',
    function($scope, $location, $timeout, Huts, HutDB) {

    var curQuery = 0;

    $scope.loading = 0;
    $scope.huts;
    $scope.filteredHuts;
    $scope.hutsMeta;
    $scope.query;
    $scope.selectedHut;
    $scope.selectedHutRegion;
    $scope.selectedHutAgency;

    $scope.resetLoading = function() { $scope.loading = 0; };
    $scope.incLoading = function() { $scope.loading++; };
    $scope.decLoading = function() { if ($scope.loading > 0) { $scope.loading--; } };

    $scope.setQuery = function(query) {
      $scope.query = query;
    };

    $scope.setSelectedHut = function(hut) {
      $scope.selectedHut = hut;
    };

    $scope.setFilteredHuts = function(filteredHuts) {
      $scope.filteredHuts = filteredHuts;
    };

    var doQuery = function(id, query) {
      if (query) {
        $scope.incLoading();
        HutDB.query(query, 
          function(resp) {
            $scope.decLoading();
            if (id === curQuery) {
              $scope.resetLoading();
              $scope.huts = resp.objects;
              $scope.hutsMeta = resp.meta;
            }
          },
          function(error) {
            $scope.decLoading();
            // TODO: notify of error
          }
        );

        /*
        Huts.query(query, 
          function(resp) {
            $scope.decLoading();
            if (id === curQuery) {
              $scope.resetLoading();
              $scope.huts = resp.objects;
              $scope.hutsMeta = resp.meta;
            }
          },
          function(error) {
            $scope.decLoading();
            // TODO: notify of error
          }
        );
        */
      }
    };

    var updateLocation = function(query) {
      if (query) {
        angular.forEach(query, function(value, key) {
          $location.search('h_' + key, value);
        });
      }
    };

    var updateScope = function() {
      var search = $location.search();
      var newQuery = {};
      var shouldUpdate = false;
      angular.forEach(search, function(value, key) {
        if (key.lastIndexOf('h_', 0) === 0) {
          key = key.substring(2);
          newQuery[key] = value;
          shouldUpdate = true;
        }
      });
      if (shouldUpdate) {
        $scope.query = newQuery;
      }
    };

    $scope.$watch('query', function(newQuery) {
      if (newQuery != null) {
        var id = ++curQuery;
        $timeout(function() {
          // only do query if there is not a newer one
          if (id === curQuery) {
            doQuery(id, newQuery);
          }
        }, 1000);
        //updateLocation(newQuery);
      }
    });

    $scope.$watch('hutsMeta.total_count', function(newValue) {
      if (newValue) {
        console.log(newValue);
      }
    });

    //updateScope();

  }]);
})();
