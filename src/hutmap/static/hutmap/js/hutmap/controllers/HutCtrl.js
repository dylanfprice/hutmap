'use strict';

(function () {
  angular.module('hutmap.controllers').

  controller('HutCtrl', 
    ['$scope', '$location', '$timeout', 'Huts',
    function($scope, $location, $timeout, Huts) {

    var curQuery = 0; // incremented every time there's a new hut query

    $scope.h = {
      loading: 0,            // truthy if huts are being queried/loaded
      huts: null,            // array of hut objects in current viewport
      filteredHuts: null,    // array of hut objects corresp. to those matching the filters
      filteredHutIds: null,  // sparse array of hut ids, each id is in filteredHutIds[id]
      query: null,           // current query for the Huts service
      selectedHut: null, 
      selectedHutRegion: null,
      selectedHutAgency: null,
    };
    
    // fns for dealing with loading variable
    $scope.resetLoading = function() { $scope.h.loading = 0; };
    $scope.incLoading = function() { $scope.h.loading++; };
    $scope.decLoading = function() { if ($scope.h.loading > 0) { $scope.h.loading--; } };

    // for child scopes
    $scope.$watch('h.selectedHut', function(hut) {
      if (hut) {
        Huts.agency(hut.agency).then(function(agency) {
          $scope.h.selectedHutAgency = agency;
        });
        Huts.region(hut.region).then(function(region) {
          $scope.h.selectedHutRegion = region;
        });
      }
    });

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
              $scope.h.huts = resp;
            }
          },
          function(error) {
            $scope.decLoading();
            // TODO: notify of error?
          }
        );
      }
    };

    // when query changes, send query to Huts service and update $scope.h.huts
    // with results
    $scope.$watch('h.query', function(newQuery) {
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
      if ($scope.h.selectedHut) {
        $location.search('h_selected', $scope.h.selectedHut.id);
      }
    });
   
    // update scope from browser url
    var updateScope = function() {
      var id = $location.search().h_selected;
      $location.search('h_selected', null);
      if (id) {
        Huts.hut(id).then(function(hut) {
          $scope.h.selectedHut = hut;
          $scope.$broadcast('clickSelected');
        });
      }
    };

    // we update scope from browser url once, at beginning
    updateScope();

  }]);
})();
