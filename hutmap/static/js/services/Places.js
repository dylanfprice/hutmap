(function () {
'use strict';

  angular.module('hutmap.services').

  // access the google.maps.places service
  provider('Places', [function() {
    var PlacesProvider = {}

    var bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-90, 180),
      new google.maps.LatLng(90, -180)
    );

    PlacesProvider.bounds = function(latLngBounds) {
      bounds = latLngBounds;
    };

    PlacesProvider.$get = function() {
      var Places = {};

      var elt = angular.element('<div id="google-attributions"></div>');
      var placesService = new google.maps.places.PlacesService(elt[0]);
      var autocompleteService = new google.maps.places.AutocompleteService();

      function callback(success, error, result, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          success(result);
        } else {
          error(status);
        }
      }

      /**
       * See https://developers.google.com/maps/documentation/javascript/places
       * getPlacePredictions
       *
       * @param {string} input - the query
       * @param {function} success
       * @param {function} error
       */
      Places.getPlacePredictions = function(input, success, error) {
        autocompleteService.getPlacePredictions({input: input, bounds: bounds}, 
            angular.bind(this, callback, success, error));
      }

      /**
       * See https://developers.google.com/maps/documentation/javascript/places
       * getDetails
       *
       * @param {string} reference - the place reference
       * @param {function} success
       * @param {function} error
       */
      Places.getDetails = function(reference, success, error) {
        placesService.getDetails({reference: reference}, 
          angular.bind(this, callback, success, error));
      };

     /**
     * See https://developers.google.com/maps/documentation/javascript/places
     * getDetails
     *
     * @param {string} request - the query
     * @param {function} success
     * @param {function} error
     */
     Places.textSearch = function(request, success, error) {
        placesService.textSearch(request, 
            angular.bind(this, callback, success, error));
      }

      return Places;
    };

    return PlacesProvider;
  }]);

})();
