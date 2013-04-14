'use strict';

(function () {
  angular.module('hutmap').

  controller('SearchCtrl', 
    ['$scope', '$location', '$route', '$log', 'Places', 
    function($scope, $location, $route, $log, Places) {

    $scope.submitting = false;
    $scope.autocompleting = 0;
    $scope.lastQuery;
    $scope.selected;

    $scope.getPlaces = function(query) {
      $scope.lastQuery = query;
      if (query && !$scope.submitting) {
        $scope.autocompleting++;
        return Places.getPlacePredictions(query).then(
          function(predictions) {
            if ($scope.autocompleting > 0)
              $scope.autocompleting--;
            if (!$scope.submitting) {
              return predictions;
            } else {
              return [];
            }
          },
          function(status) { 
            if ($scope.autocompleting > 0)
              $scope.autocompleting--;
            return []; 
          }
        );
      } else {
        return [];
      }
    };

    var onError = function(status) {
      $scope.submitting = false;
      $log.error(status);
      $scope.addAlert('error', 'There was an error retrieving search results. TODO: better messages');
    };

    var selectPlace = function(place) {
      $scope.submitting = false;
      $route.reload();
      $location.
        path('/map/').
        search({}).
        search('m_zoom', 8);

      if (place.geometry.location) {
        $location.search('m_center', place.geometry.location.toUrlValue());
        $location.search('m_selected', place.geometry.location.toUrlValue());
      }
      if (place.geometry.viewport) {
        $location.search('m_bounds', place.geometry.viewport.toUrlValue());
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
        $scope.autocompleting = 0;
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
          $scope.autocompleting = 0;
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
