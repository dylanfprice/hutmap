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
  constant('googleMapsConfigDefaults', {
    maps: {
      'default': {
        mapOptions: {
          zoom : 8,
          center : new google.maps.LatLng(46.87916, -120),
          mapTypeId : google.maps.MapTypeId.ROADMAP
        },
        markerTypes: {
          'default': {
            markerOptions: {
            }
          }
        },
        selectedMarker: {
          markerOptions: {
          } 
        }
      }
    },
  }).

  /**
   * Override this service in your app to provide configuration for the map,
   * markers, etc.
   *
   * Format is as follows, refer to the googleMapsConfigDefaults constant
   * service for an example.
   *
   * maps: {
   *   'mapId1': {
   *     mapOptions: {
   *       // google.maps.MapOptions here
   *     },
   *     markerTypes: {
   *       'type1': {
   *         markerOptions: {
   *           // google.maps.MarkerOptions here
   *         }
   *       },
   *       // more marker types may go here...
   *     },
   *     selectedMarker: {
   *       markerOptions: {
   *         // google.maps.MarkerOptions here
   *       }
   *     }
   *   },
   *   // more map ids may go here...
   * }
   */
  value('googleMapsConfig', {});

})();
