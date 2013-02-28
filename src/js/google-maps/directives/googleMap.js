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
    var objToLatLng = googleMapsUtils.objToLatLng;
    var objToBounds = googleMapsUtils.objToBounds;
    var latLngToObj = googleMapsUtils.latLngToObj;
    var boundsToObj = googleMapsUtils.boundsToObj;


    /** link function **/

    function link(scope, element, attrs, controller) {
      // initialize scope
      if (!angular.isDefined(scope.center)) {
        scope.center = {};
      }
      if (!angular.isDefined(scope.bounds)) {
        scope.bounds = {};
      }

      // Make sure mapId is defined
      // Note: redundant check in MapController. Can't hurt.
      if (!attrs.hasOwnProperty('mapId')) {
        throw 'googleMap must have non-empty mapId attribute';
      }

      // Check what's defined in attrs
      // Note: this is also redundant since angular will throw an exception if
      // these attributes are not set. I may make these optional in the future
      // (pending angular support).
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
                  scope.bounds = boundsToObj(b);
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
          var changed = (newValue !== oldValue);
          if (changed && !controller.dragging) {
            var latLng = objToLatLng(newValue);
            if (latLng)
              controller.center = latLng;
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
          var changed = (newValue !== oldValue);
          if (changed && !controller.dragging) {
            var bounds = objToBounds(newValue);
            if (bounds)
              controller.bounds = bounds; 
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
