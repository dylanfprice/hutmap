(function () {
'use strict';

  angular.module('hutmap.controllers').

  controller('SearchCtrl', 
    ['$scope', '$location', '$route', '$log', '$q', '$document', 'Places', 
    function($scope, $location, $route, $log, $q, $document, Places) {

    $scope.submitting = false;
    $scope.autocompleting = 0;
    $scope.lastQuery;
    $scope.selected; // updated as user types, or when user selects an item in autocomplete

    // next two are used to lose focus on search bar properly
    $scope.clickBody = function() {
      $document.find('body').triggerHandler('click');
    };

    $scope.blurInput = function() {
      $document.find('input').trigger('blur');
    };

    // given user input, return a promise that resolves to list of autocomplete
    // suggestions
    $scope.getPlaces = function(query) {
      $scope.lastQuery = query;
      var deferred = $q.defer();
      $scope.autocompleting++;
      Places.getPlacePredictions(query, 
        function(predictions) {
          $scope.$apply(function() {
            $scope.autocompleting--;
            deferred.resolve(predictions);
          });
        },
        function(status) {
          $scope.$apply(function() {
            $scope.autocompleting--;
            deferred.resolve([]);
          });
        }
      );
      return deferred.promise;
    };

    var onError = function(status) {
      $scope.submitting = false;
      $log.error(status);
      $scope.addAlert('error', 'There was an error retrieving search results. TODO: better messages');
    };

    // given PlaceResult (https://developers.google.com/maps/documentation/javascript/places#place_details_responses)
    // send us to that place 
    var selectPlace = function(place) {
      $scope.submitting = false;
      $route.reload();
      $location.
        path(hutmap.url.map).
        search({}).
        search('m_zoom', 8);

      if (place.geometry.location) {
        $location.search('m_center', place.geometry.location.toUrlValue());
      }
      if (place.geometry.viewport) {
        $location.search('m_bounds', place.geometry.viewport.toUrlValue());
      }
    };

    // when user selects an autocomplete suggestion, this gets triggered
    // also when user is typing, hence the need to test for Object
    $scope.$watch('selected', function(selected) {
      if (selected && selected.constructor === Object) {
        $scope.submit(selected);
      }
    });

    // called when user hits enter in search bar, or clicks search icon
    $scope.search = function(query) {

      var noResults = function() {
        // TODO
      };

      if (query && query.constructor === Object) {
        $scope.submit(query);
      } else if (query) {
        $scope.getPlaces(query).then(function(results) {
          if (results.length > 0) {
            $scope.submit(results[0]);
          } else {
            noResults();
          }
        });
      } else {
        noResults();
      }
    };

    // submits a search
    // given an autocomplete result, take us to the place
    $scope.submit = function(selected) {
      if (selected && selected.reference) {
        $scope.submitting = true;
        $scope.autocompleting = 0;
        Places.getDetails(selected.reference,
          function(place) {
            $scope.$apply(function() {
              selectPlace(place);
            });
            $scope.blurInput();
          },
          onError
        );
      }    
    };

  }]);
})();
