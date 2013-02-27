'use strict';

(function () {
  angular.module('google-maps').

  /**
   * Modified version of Nicolas Laplante's angular-google-maps directive
   * https://github.com/nlaplante/angular-google-maps
   */
  directive('googleMap', ['$timeout', 'googleMapsUtils', 'googleMapControllerFactory',
    function ($timeout, googleMapsUtils, googleMapControllerFactory) {
  
    /** aliases **/
    var latLngToObj = googleMapsUtils.latLngToObj;

    /** link function **/

    function link(scope, element, attrs, controller) {
      // initialize scope
      if (!angular.isDefined(scope.center)) {
        scope.center = {};
      }
      if (!angular.isDefined(scope.bounds)) {
        scope.bounds = {};
      }

      // Check what's defined in attrs
      var hasCenter = false;
      var hasZoom = false;
      var hasBounds = false;

      if (attrs.hasOwnProperty('center')) {
        hasCenter = true;
      }
      if (attrs.hasOwnProperty('zoom')) {
        hasZoom = true;
      }
      if (attrs.hasOwnProperty('bounds')) {
        hasBounds = true;
      }

      var updateScope = function() {
        $timeout(function () {
          if (hasCenter || hasZoom || hasBounds) {
            scope.$apply(function (s) {
              if (hasCenter) {
                scope.center = latLngToObj(controller.center);
              }
              if (hasZoom) {
                scope.zoom = controller.zoom;
              }
              if (hasBounds) {
                var b = controller.bounds;
                if (b) {
                  scope.bounds = {
                    southWest: latLngToObj(b.getSouthWest()),
                    northEast: latLngToObj(b.getNorthEast())
                  };
                }
              }
            });
          }
        });
      };

      controller.addListener('drag', updateScope);
      controller.addListener('zoom_changed', updateScope);
      controller.addListener('center_changed', updateScope);
      // update values when map is loaded
      controller.addListenerOnce('bounds_changed', updateScope);
      
      if (hasCenter) {
        scope.$watch('center', function (newValue, oldValue) {
          var ok = (newValue != null && !isNaN(newValue));
          var changed = (newValue !== oldValue);
          if (ok && changed && !controller.dragging) {
            controller.center = new google.maps.LatLng(newValue.lat, 
                newValue.lng);          
          }
        }, true);
      }
      
      if (hasZoom) {
        scope.$watch('zoom', function (newValue, oldValue) {
          var ok = (newValue != null && !isNaN(newValue));
          if (ok && newValue !== oldValue) {
            controller.zoom = newValue;
          }
        });
      }

      if (hasBounds) {
        scope.$watch('bounds', function(newValue, oldValue) {
          var ok = (newValue != null && !isNaN(newValue));
          var changed = (newValue !== oldValue);
          if (ok && changed && !controller.dragging) {
            controller.bounds = new google.maps.LatLngBounds(
              new google.maps.LatLng(newValue.southWest),
              new google.maps.LatLng(newValue.northEast));
          }
        });
      }
    }


    return {
      restrict: 'AE',
      priority: 100,
      template: '<div>' + 
                  '<div id="" style="width:100%;height:100%;"></div>' + 
                  '<div ng-transclude></div>' + 
                '</div>',
      transclude: true,
      replace: true,
      scope: {
        center: '=',
        zoom: '=',
        bounds: '='
      },
      controller: googleMapControllerFactory.MapController,
      link: link
    };
  }]);
}());
