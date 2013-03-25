'use strict';

(function () {
  angular.module('hutmapServices', []).

  factory('Huts', ['$resource', function($resource){
    return $resource('/huts/api/v1/hut', {}, {
      query: {method:'GET', params:{}
    }});
  }]).

  factory('Places', ['$q', function($q) {
    var elt = angular.element('<div id="google-attributions"></div>');
    var placesService = new google.maps.places.PlacesService(elt[0]);
    var autocompleteService = new google.maps.places.AutocompleteService();

    function callback(deferred, result, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        deferred.resolve(result);
      } else {
        deferred.reject(status);
      }
    }

    function getDetails(reference) {
      var deferred = $q.defer();
      placesService.getDetails({reference: reference}, angular.bind(this, callback, deferred));
      return deferred.promise;
    }

    function textSearch(request) {
      var deferred = $q.defer();
      placesService.textSearch(request, angular.bind(this, callback, deferred));
      return deferred.promise;
    }

    function getPlacePredictions(input) {
      var deferred = $q.defer();
      autocompleteService.getPlacePredictions({input: input}, angular.bind(this, callback, deferred));
      return deferred.promise;
    }

    return {
      getDetails: getDetails,
      textSearch: textSearch,
      getPlacePredictions: getPlacePredictions
    }
  }]).

  factory('utils', [function() {

    function latLngFromUrlValue(urlValue) {
      var array = urlValue.split(',');
      return new google.maps.LatLng(array[0], array[1]);
    }

    function boundsFromUrlValue(urlValue) {
      var array = urlValue.split(',');
      return new google.maps.LatLngBounds(
        new google.maps.LatLng(array[0], array[1]),
        new google.maps.LatLng(array[2], array[3])
      );

    }

    return {
      latLngFromUrlValue: latLngFromUrlValue,
      boundsFromUrlValue: boundsFromUrlValue
    }
  }]);

})();
