'use strict';

(function () {
  angular.module('hutmap').

  controller('SearchCtrl', 
    ['$scope', '$location', '$route', '$log', 'Places', 
    function($scope, $location, $route, $log, Places) {

    $scope.submitting = false;
    $scope.lastQuery;
    $scope.selected;

    $scope.getPlaces = function(query) {
      $scope.lastQuery = query;
      if (query && !$scope.submitting) {
        return Places.getPlacePredictions(query);
      } else {
        return [];
      }
    };

    var onError = function(status) {
      $scope.submitting = false;
      $log.error(status);
      $scope.addAlert({
        type: 'error',
        msg: 'There was an error retrieving search results. TODO: better messages'
      });
    };

    var selectPlace = function(place) {
      $scope.submitting = false;
      $route.reload();
      // TODO: change this to events, or make a parent scope that MapCtrl can watch?
      $location.
        path('/map/').
        search('m_center', place.geometry.location.toUrlValue()).
        search('m_zoom', 8);
        if (place.geometry.viewport) {
          $location.search('h_bbox', place.geometry.viewport.toUrlValue());
        }
    };

    $scope.$watch('selected', function(selected) {
      if (selected) {
        $scope.submit();
      }
    });

    $scope.submit = function() {
      if ($scope.selected) {
        $scope.submitting = true;
        var selected = $scope.selected;
        if (selected.reference) {
          Places.getDetails(selected.reference).then(
            function(place) {
              selectPlace(place);
            },
            onError
          );
        }
      } else {
        var lastQuery = $scope.lastQuery;
        if (lastQuery) {
          $scope.submitting = true;
          Places.getPlacePredictions(lastQuery).then(
            function(predictions) {
              Places.getDetails(predictions[0].reference).then(
                function(place) {
                  selectPlace(place);
                },
                onError
              );
            },
            onError
          );
        }
      }
    };
  }]);
})();
