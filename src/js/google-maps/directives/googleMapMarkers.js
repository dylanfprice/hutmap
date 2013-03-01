'use strict';

(function () {
  angular.module('google-maps').

  /**
   * Inspired by Nicolas Laplante's angular-google-maps directive
   * https://github.com/nlaplante/angular-google-maps
   */
  directive('googleMapMarkers', ['$log', '$timeout', 'googleMapsUtils', function($log, $timeout, googleMapsUtils) {

    /** aliases */
    var objToLatLng = googleMapsUtils.objToLatLng;

    function link(scope, element, attrs, controller) {

      var updateMarkers = function(objects) {
        angular.forEach(objects, function(object, i) {
          var latLngObj = scope.getLatLng({object: object});
          var position = objToLatLng(latLngObj);
          var options = {};
          angular.extend(options, scope.markerOptions(), {position: position});
          var added = controller.addMarker(options);
          if (!added) {
            $log.error('Already have a marker for object with position ', position, '.');
          } else {
            var marker = controller.getMarker(latLngObj.lat, latLngObj.lng);
          }
        });
      };

      scope.$watch('objects()', function(newValue, oldValue) {
        if (newValue != null && newValue !== oldValue) {
          updateMarkers(newValue);
        }
      });

      
      // Add marker (testing only)
      /*
      var marker = {
        position: new google.maps.LatLng(46.8791, -120)
      };
      controller.addMarker(marker);
      marker = {
        position: new google.maps.LatLng(46.8791, -120.0001)
      };
      controller.addMarker(marker);

      // Set up onMarkerSelected callbacks
      if (scope.onMarkerSelected) {
        controller.forEachMarker(function(marker) {
          google.maps.event.addListener(marker, 'click', function() {
            $timeout(function() {
              var locals = {'$marker': marker};
              scope.onMarkerSelected(locals);
            });
          });
        });
      }
      */
    }


    return {
      restrict: 'AE',
      priority: 100,
      scope: {
        objects: '&',
        getLatLng: '&',
        markerOptions: '&'
      },
      require: '^googleMap',
      link: link
    };
  }]);
})();

/**
   
    
    
   
        // Markers
        scope.$watch('markers', function (newValue, oldValue) {
          
          $timeout(function () {
            
            angular.forEach(newValue, function (v, i) {
              if (!_m.hasMarker(v.latitude, v.longitude)) {
                _m.addMarker(v.latitude, v.longitude);
              }
            });
            
            // Clear orphaned markers
            var orphaned = [];
            
            angular.forEach(_m.getMarkerInstances(), function (v, i) {
              // Check our scope if a marker with equal latitude and longitude. 
              // If not found, then that marker has been removed form the scope.
              
              var pos = v.getPosition(),
                lat = pos.lat(),
                lng = pos.lng(),
                found = false;
              
              // Test against each marker in the scope
              for (var si = 0; si < scope.markers.length; si++) {
                
                var sm = scope.markers[si];
                
                if (floatEqual(sm.latitude, lat) && floatEqual(sm.longitude, lng)) {
                  // Map marker is present in scope too, don't remove
                  found = true;
                }
              }
              
              // Marker in map has not been found in scope. Remove.
              if (!found) {
                orphaned.push(v);
              }
            });

            orphaned.length && _m.removeMarkers(orphaned);           
            
            // Fit map when there are more than one marker. 
            // This will change the map center coordinates
            if (attrs.fit == 'true' && newValue.length > 1) {
              _m.fit();
            }
          });
          
        }, true);
        

*/
