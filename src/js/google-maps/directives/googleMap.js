'use strict';

(function () {
  angular.module('google-maps').

  /**
   * A directive for embedding google maps into your app. 
   *
   * Usage:
   * <gm-map gm-map-id="myMapId" gm-center="myCenter" gm-zoom="myZoom" gm-bounds="myBounds" gm-map-options="myMapOptions"></gm-map>
   *
   * myMapId:       just a string that is a unique identifier for your map (you may
   *                have multiple maps/instances of the directive)
   *
   * myCenter:      name that you want a center variable in the current scope to
   *                have. The value will be of the form { lat: 40, lng: -120 } 
   *
   * myZoom:        name that you want for a zoom variable in the current scope.
   *                Value will be an integer.
   *
   * myBounds:      name that you want for a bounds variable in the current scope.
   *                Value will be of the form { 
   *                  southWest: { lat: 40, lng: -120 }, 
   *                  northEast: { lat: 40, lng: -120 }
   *                }
   *
   * myMapOptions:  object in the current scope that is a
   *                google.maps.MapOptions object. If unspecified, will use the
   *                values in googleMapsDefaults.mapOptions.
   *                'googleMapsDefaults' is a service, so it is both injectable
   *                and overrideable (using $provide.decorator).
   *
   * All attributes expect map-options are required. The myCenter, myZoom, and
   * myBounds variables do not have to exist in the current scope--they will be
   * created if necessary. All three have bi-directional association, i.e. drag
   * or zoom the map and they will update, update them and the map will change.
   * However, any initial state of these variables will be ignored.
   *
   * For more on configuring defaults, see module.js.
   *
   * If you need to get a handle on the google.maps.Map object, see
   * googleMapsContainer.js
   *
   *
   * Inspired by Nicolas Laplante's angular-google-maps directive
   * https://github.com/nlaplante/angular-google-maps
   */
  directive('gmMap', ['$timeout', 'googleMapsUtils', 'googleMapControllerFactory',
    function ($timeout, googleMapsUtils, googleMapControllerFactory) {
  
    /** aliases **/
    var objToLatLng = googleMapsUtils.objToLatLng;
    var objToBounds = googleMapsUtils.objToBounds;
    var latLngToObj = googleMapsUtils.latLngToObj;
    var boundsToObj = googleMapsUtils.boundsToObj;


    /** link function **/

    function link(scope, element, attrs, controller) {
      // initialize scope
      if (!angular.isDefined(scope.gmCenter)) {
        scope.center = {};
      }
      if (!angular.isDefined(scope.gmBounds)) {
        scope.bounds = {};
      }

      // Make sure gmMapId is defined
      // Note: redundant check in MapController. Can't hurt.
      if (!attrs.hasOwnProperty('gmMapId')) {
        throw 'googleMap must have non-empty gmMapId attribute';
      }

      // Check what's defined in attrs
      // Note: this is also redundant since angular will throw an exception if
      // these attributes are not set. I may make these optional in the future
      // (pending angular support).
      var hasCenter = false;
      var hasZoom = false;
      var hasBounds = false;

      if (attrs.hasOwnProperty('gmCenter')) {
        hasCenter = true;
      }
      if (attrs.hasOwnProperty('gmZoom')) {
        hasZoom = true;
      }
      if (attrs.hasOwnProperty('gmBounds')) {
        hasBounds = true;
      }

      var updateScope = function() {
        $timeout(function () {
          if (hasCenter || hasZoom || hasBounds) {
            scope.$apply(function (s) {
              if (hasCenter) {
                scope.gmCenter = latLngToObj(controller.center);
              }
              if (hasZoom) {
                scope.gmZoom = controller.zoom;
              }
              if (hasBounds) {
                var b = controller.bounds;
                if (b) {
                  scope.gmBounds = boundsToObj(b);
                }
              }
            });
          }
        });
      };

      controller.addMapListener('drag', updateScope);
      controller.addMapListener('zoom_changed', updateScope);
      controller.addMapListener('center_changed', updateScope);
      controller.addMapListener('bounds_changed', updateScope);
      
      if (hasCenter) {
        scope.$watch('gmCenter', function (newValue, oldValue) {
          var changed = (newValue !== oldValue);
          if (changed && !controller.dragging) {
            var latLng = objToLatLng(newValue);
            if (latLng)
              controller.center = latLng;
          }
        }, true);
      }
      
      if (hasZoom) {
        scope.$watch('gmZoom', function (newValue, oldValue) {
          var ok = (newValue != null && !isNaN(newValue));
          if (ok && newValue !== oldValue) {
            controller.zoom = newValue;
          }
        });
      }

      if (hasBounds) {
        scope.$watch('gmBounds', function(newValue, oldValue) {
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
        gmCenter: '=',
        gmZoom: '=',
        gmBounds: '=',
        gmMapOptions: '&'
      },
      controller: googleMapControllerFactory.MapController,
      link: link
    };
  }]);
}());
