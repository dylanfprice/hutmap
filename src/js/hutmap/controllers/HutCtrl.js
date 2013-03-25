'use strict';

(function () {
  angular.module('hutmap').

  controller('HutCtrl', ['$scope', '$location', 'Huts', function($scope, $location, Huts) {

    var count = 0;

    $scope.huts;
    $scope.hutsMeta;
    $scope.query;
    $scope.selectedHut;

    $scope.setQuery = function(query) {
      $scope.query = query;
    };

    $scope.setSelectedHut = function(hut) {
      $scope.selectedHut = hut;
    };

    var doQuery = function(query) {
      if (query) {
        var id = ++count;
        $scope.incLoading();
        var hutQuery = Huts.query(query, 
          function() {
            $scope.decLoading();
            if (id === count) {
              $scope.huts = hutQuery.objects;
              $scope.hutsMeta = hutQuery.meta;
            }
          },
          function(error) {
            $scope.decLoading();
            // TODO: notify of error
          }
        );
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
        doQuery(newQuery);
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
