'use strict';

/**
 * Module for embedding google maps into applications.
 *
 * See...
 * directives/googleMap.js          for usage of the <google-map> directive
 * directives/googleMapMarkers.js   for usage of the <google-map-markers> directive
 * services/googleMapsContainer.js  if you need to run custom configuration on the map, e.g. add new map types
 */
(function() {
  angular.module('google-maps', []).

  /**
   * Default configuration.
   */
  value('googleMapsDefaults', {
    'mapOptions': {
      zoom : 8,
      center : new google.maps.LatLng(46.87916, -120),
      mapTypeId : google.maps.MapTypeId.ROADMAP
    },
  });

})();
