'use strict';

(function () {
  angular.module('hutmap.controllers').

  controller('HutCtrl', 
    ['$scope', '$location', '$timeout', 'Huts',
    function($scope, $location, $timeout, Huts) {

    var curQuery = 0; // incremented every time there's a new hut query

    $scope.loading = 0; // truthy if huts are being queried/loaded
    $scope.huts; // array of hut objects
    $scope.filteredHuts; // array of hut objects corresp. to those matching the filters
    $scope.filteredHutIds; // sparse array of hut ids, each id is in filteredHutIds[id]
    $scope.query; // current query for the Huts service
    $scope.selectedHut; 
    $scope.selectedHutRegion;
    $scope.selectedHutAgency;
    $scope.loadNewHuts = true; // if false, query doesn't change on map pan/zoom

    // fns for dealing with loading variable
    $scope.resetLoading = function() { $scope.loading = 0; };
    $scope.incLoading = function() { $scope.loading++; };
    $scope.decLoading = function() { if ($scope.loading > 0) { $scope.loading--; } };

    // for child scopes
    $scope.setQuery = function(query) {
      $scope.query = query;
    };

    // for child scopes
    $scope.setFilteredHuts = function(filteredHuts, filteredHutIds) {
      $scope.filteredHuts = filteredHuts;
      $scope.filteredHutIds = filteredHutIds;
    };

    // for child scopes
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

    // performs the work of the 'query' $watch expression
    var doQuery = function(id, query) {
      if (query) {
        $scope.incLoading();
        Huts.query(query).then(
          function(resp) {
            $scope.decLoading();
            // only update huts if there is not a newer query
            if (id === curQuery) {
              $scope.resetLoading();
              $scope.huts = resp;
            }
          },
          function(error) {
            $scope.decLoading();
            // TODO: notify of error?
          }
        );
      }
    };

    // when query changes, send query to Huts service and update $scope.huts
    // with results
    $scope.$watch('query', function(newQuery) {
      if (newQuery != null) {
        var id = ++curQuery;
        $timeout(function() {
          // only do query if there is not a newer one
          if (id === curQuery) {
            doQuery(id, newQuery);
          }
        });
      }
    });
 
    // update browser url from scope
    $scope.$on('updateLocation', function() {
      if ($scope.selectedHut) {
        $location.search('h_selected', $scope.selectedHut.id);
      }
    });
   
    // update scope from browser url
    var updateScope = function() {
      var id = $location.search().h_selected;
      if (id) {
        Huts.hut(id).then(function(hut) {
          $scope.setSelectedHut(hut);
          $scope.$broadcast('clickSelected');
        });
      }
    };

    // we update scope from browser url once, at beginning
    updateScope();

  }]);
})();
