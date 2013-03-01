'use strict';

(function () {
  angular.module('google-maps').

  /**
   * Inspired by Nicolas Laplante's angular-google-maps directive
   * https://github.com/nlaplante/angular-google-maps
   */
  directive('googleMapMarkers', ['$log', '$parse', '$timeout', 'googleMapsUtils', 
    function($log, $parse, $timeout, googleMapsUtils) {

    /** aliases */
    var latLngEqual = googleMapsUtils.latLngEqual;
    var objToLatLng = googleMapsUtils.objToLatLng;


    function link(scope, element, attrs, controller) {
      // check attrs
      if (!('objects' in attrs)) {
        throw 'objects attribute required';
      } else if (!('getLatLng' in attrs)) {
        throw 'getLatLng attribute required';
      }

      var handlers = {}; // map events -> handlers

      // retrieve on-___ handlers
      angular.forEach(attrs, function(value, key) {
        if (key.lastIndexOf('on', 0) === 0) {
          var event = angular.lowercase(key.substring(2));
          var fn = $parse(value);
          handlers[event] = fn;
        }
      });

      // fn for updating markers from objects
      var updateMarkers = function(objects) {

        var markerOptions = scope.markerOptions();
        var objectHash = {};

        angular.forEach(objects, function(object, i) {
          var latLngObj = scope.getLatLng({object: object});
          var position = objToLatLng(latLngObj);
          if (position == null) {
            return;
          }

          // hash objects for quick access
          var hash = position.toUrlValue(controller.precision);
          objectHash[hash] = object;

          // add marker
          if (!controller.hasMarker(latLngObj.lat, latLngObj.lng)) {

            var options = {};
            angular.extend(options, markerOptions, {position: position});

            controller.addMarker(options);
            var marker = controller.getMarker(latLngObj.lat, latLngObj.lng);

            // set up marker event handlers
            angular.forEach(handlers, function(handler, event) {
              controller.addListener(marker, event, function() {
                $timeout(function() {
                  console.log('called');
                       // scope is this directive's isolate scope
                       // scope.$parent is the scope of ng-transclude
                       // scope.$parent.$parent is the one we want
                  handler(scope.$parent.$parent, {
                    object: object,
                    marker: marker
                  });
                });
              });
            });
          }
        });

        // remove 'orphaned' markers
        var orphaned = [];
        
        controller.forEachMarker(function(marker) {
          var markerPosition = marker.getPosition();
          var hash = markerPosition.toUrlValue(controller.precision);

          if (!(hash in objectHash)) {
            orphaned.push(marker);
          }
        });

        angular.forEach(orphaned, function(marker, i) {
          var position = marker.getPosition();
          controller.removeMarker(position.lat(), position.lng());
        });
      }; // end updateMarkers()

      // watch objects
      scope.$watch('objects().length', function(newValue, oldValue) {
        if (newValue != null && newValue !== oldValue) {
          updateMarkers(scope.objects());
        }
      });

      // initialize markers
      $timeout(angular.bind(this, updateMarkers, scope.objects()));
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
