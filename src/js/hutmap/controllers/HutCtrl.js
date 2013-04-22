'use strict';

(function () {
  angular.module('hutmap').

  controller('HutCtrl', 
    ['$scope', '$location', '$timeout', 'Huts',
    function($scope, $location, $timeout, Huts) {

    var curQuery = 0;

    $scope.loading = 0;
    $scope.huts;
    $scope.filteredHuts;
    $scope.totalHutCount;
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

    $scope.setFilteredHuts = function(filteredHuts) {
      $scope.filteredHuts = filteredHuts;
    };

    $scope.setSelectedHut = function(hut) {
      $scope.selectedHut = hut;
      if (hut) {
        Huts.agency(hut.agency).then(function(agency) {
          $scope.selectedHutAgency = agency;
        });
        Huts.region(hut.region).then(function(region) {
          $scope.selectedHutRegion = region;
        });
      }
    };

    var doQuery = function(id, query) {
      if (query) {
        $scope.incLoading();
        Huts.query(query).then(
          function(resp) {
            $scope.decLoading();
            if (id === curQuery) {
              $scope.resetLoading();
              $scope.huts = resp;
            }
          },
          function(error) {
            $scope.decLoading();
            // TODO: notify of error
          }
        );
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
      }
    });

    Huts.totalHutCount().then(function(totalHutCount) {
      $scope.totalHutCount = totalHutCount;
    });

  }]);
})();
