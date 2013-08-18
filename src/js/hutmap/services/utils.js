'use strict';

(function () {
  angular.module('hutmap.services').

  factory('utils', [function() {
    var utils = {};

    /**
     * @param {string} urlValue - of the form 'lat,lon'
     * @return {google.maps.LatLng}
     */
    utils.latLngFromUrlValue = function(urlValue) {
      var array = urlValue.split(',');
      return new google.maps.LatLng(array[0], array[1]);
    }

    /**
     * @param {object} hut - hut object
     * @return {google.maps.LatLng} the location of the hut
     */
    utils.latLngFromHut = function(hut) {
      return new google.maps.LatLng(hut.location.coordinates[1],
        hut.location.coordinates[0]);
    };
    
    /**
     * @param {string} urlValue - of the form 'lat_lo,lng_lo,lat_hi,lng_hi'
     * @return {google.maps.LatLngBounds}
     */
    utils.boundsFromUrlValue = function(urlValue) {
      var array = urlValue.split(',');
      return new google.maps.LatLngBounds(
        new google.maps.LatLng(array[0], array[1]),
        new google.maps.LatLng(array[2], array[3])
      );
    }

    return utils;
  }]);

})();
