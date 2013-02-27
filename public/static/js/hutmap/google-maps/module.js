'use strict';

(function() {
  angular.module('google-maps', []).

  constant('googleMapsConfigDefaults', {
    maps: {
      'default': {
        zoom : 8,
        center : new google.maps.LatLng(46.87916, -120),
        mapTypeId : google.maps.MapTypeId.ROADMAP
      }
    },
    markerTypes: {
      'default': {}
    },
    selectedMarker: {},
    getLatLng: function(object) {
      var latLng = {lat: 0, lng: 0};
      if (object) {
        latLng.lat = object.lat;
        latLng.lng = object.lng;
      }
    }
  }).

  value('googleMapsConfig', {});

})();
