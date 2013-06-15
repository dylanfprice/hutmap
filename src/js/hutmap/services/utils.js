'use strict';

(function () {
  angular.module('hutmap.services').

  factory('utils', [function() {
    var utils = {};

    utils.latLngFromUrlValue = function(urlValue) {
      var array = urlValue.split(',');
      return new google.maps.LatLng(array[0], array[1]);
    }

    utils.latLngFromHut = function(hut) {
      return new google.maps.LatLng(hut.location.coordinates[1],
        hut.location.coordinates[0]);
    };
    
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
