(function () {
  angular.module('hutmap').

  controller('HutCtrl', ['$scope', '$location', 'Huts', function($scope, $location, Huts) {
    $scope.huts;
    $scope.hutsById;
    $scope.hutsMeta;
    $scope.currentQuery;
    $scope.selectedHut;

    $scope.setQuery = function(query) {
      $scope.currentQuery = query;
    };

    var doQuery = function(query) {
      if (query) {
        var hutQuery = Huts.query(query, function() {
          $scope.huts = hutQuery.objects;
          $scope.hutsMeta = hutQuery.meta;
        });
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
        $scope.currentQuery = newQuery;
      }
    };

    $scope.$watch('currentQuery', function(newQuery) {
      if (newQuery != null) {
        doQuery(newQuery);
        updateLocation(newQuery);
      }
    });

    $scope.$watch('hutsMeta.total_count', function(newValue) {
      if (newValue) {
        console.log(newValue);
      }
    });

    updateScope();

  }]);
})();
