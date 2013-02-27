'use strict';

(function () {
  angular.module('google-maps').

  factory('googleMapControllerFactory', ['googleMapsUtils', 'googleMapsConfig', 'googleMapsConfigDefaults', 'googleMapsContainer',  
    function (googleMapsUtils, googleMapsConfig, googleMapsConfigDefaults, googleMapsContainer) {

    /** aliases */
    var getMapId = googleMapsUtils.getMapId;
    var latLngEqual = googleMapsUtils.latLngEqual;
    var latLngToObj = googleMapsUtils.latLngToObj;
    var isLatLngNullOrNaN = googleMapsUtils.isLatLngNullOrNaN;
    var gMConfig = googleMapsConfig;
    var gMCDefaults = googleMapsConfigDefaults;
    var gMContainer = googleMapsContainer;


    /** MapController class **/
    
    /* 
     * @param {google.maps.Map} map
     */
    var MapController = function($scope, $element, $attrs) {

      var mapId = $attrs.mapId;
      if (!mapId) { throw 'map must have non-empty mapId attribute'; }

      var mapDiv = $element.find('[id]');
      mapDiv.attr('id', mapId);

      this._id = getMapId(mapDiv);
      var config = this._getConfig(this._id, $scope, gMConfig, gMCDefaults);
      this._map = this._createMap(this._id, mapDiv, config, gMContainer);
      this._markers = {};
      this.dragging = false;

      Object.defineProperty(this, 'center', {
        get: function() {
               return this._map.getCenter();
             },
        set: function(center) {
               if (isLatLngNullOrNaN(center)) 
                 throw 'center contains null or NaN';
               var changed = !latLngEqual(this.center, center);
               if (changed) {
                 this._map.setCenter(center);
               }
             }
      });

      Object.defineProperty(this, 'zoom', {
        get: function() {
               return this._map.getZoom();
             },
        set: function(zoom) {
               if (!(zoom != null && !isNaN(zoom))) 
                 throw 'zoom was null or NaN';
               var changed = this.zoom !== zoom;
               if (changed) {
                this._map.setZoom(self.zoom);
               }
             }
      });

      Object.defineProperty(this, 'bounds', {
        get: function() {
               return this._map.getBounds();
             },
        set: function(bounds) {
               var swEq = latLngEqual(this.bounds.getSouthWest(), bounds.getSouthWest());
               var neEq = latLngEqual(this.bounds.getNorthEast(), bounds.getNorthEast());
               var numbers = !isLatLngNullOrNaN(bounds.getSouthWest()) &&
                             !isLatLngNullOrNaN(bounds.getNorthEast());
               if (!numbers) 
                 throw 'bounds contains null or NaN';

               var changed = !(swEq && neEq);
               if (changed) {
                 this._map.fitBounds(bounds);
               }
             }
      });

      this._initDragListeners();
    };


    // Constant for toUrlValue() of google.maps.LatLng
    MapController.precision = 4;


    MapController.prototype._getConfig = function(id, $scope, gMConfig, gMCDefaults) {
      // Get config or defaults
      var finalConfig = {};
      if (gMConfig.maps && id in gMConfig.maps) {
        finalConfig = gMConfig.maps[id];
      } else {
        finalConfig = gMCDefaults.maps['default'];
      }

      // Get extra config from scope
      var extraConfig = {};

      if (angular.isDefined($scope.center) &&
          angular.isDefined($scope.center.lat) &&
          angular.isDefined($scope.center.lng)) {
        extraConfig.center = new google.maps.LatLng($scope.center.lat, $scope.center.lng);
      }

      if (angular.isDefined($scope.zoom)) {
        extraConfig.zoom = $scope.zoom;
      }

      // Merge configs
      angular.extend(finalConfig, extraConfig);

      return finalConfig;
    };


    MapController.prototype._createMap = function(id, element, config, gMContainer) {
      var map = gMContainer.getMap(id);
      if (!map) {
        map = gMContainer.addMap(id, element[0], config);
      } else {
        throw 'A map with id ' + id + ' already exists. You must use' +
          ' different ids for each instance of the googleMap directive.';
      }
      return map;
    };

        
    MapController.prototype._initDragListeners = function() {
      var self = this;
      this.addListener('dragstart', function () {
        self.dragging = true;
      });
      
      this.addListener('idle', function () {
        self.dragging = false;
      });
      
      this.addListener('drag', function() {
        self.dragging = true;   
      });
    };

    
    MapController.prototype.addListener = function(event, handler) {
      google.maps.event.addListener(this._map, 
          event, handler);
    };


    MapController.prototype.addListenerOnce = function(event, handler) {
      google.maps.event.addListenerOnce(this._map, 
          event, handler);
    };


    /**
     * @param {google.maps.Marker} marker
     */
    MapController.prototype.addMarker = function (marker) {
      if (!(marker instanceof google.maps.Marker))
          throw 'marker was null';

      var position = marker.getPosition();
      if (this.hasMarker(position)) {
        return false;
      }
      
      var hash = position.toUrlValue(MapController.precision);
      this._markers[hash] = marker;
      marker.setMap(this._map);
      return true;
    };      


    MapController.prototype.hasMarker = function(latLng) {
      return (this.getMarker(latLng) instanceof google.maps.Marker);
    };


    MapController.prototype.getMarker = function (latLng) {
      if (!(latLng instanceof google.maps.LatLng))
        throw 'latLng was null';

      var hash = latLng.toUrlValue(MapController.precision);
      if (hash in this._markers) {
        return this._markers[hash];
      } else {
        return null;
      }
    };  


    MapController.prototype.removeMarker = function(latLng) {
      if (!(latLng instanceof google.maps.LatLng))
        throw 'latLng was null';

      var removed = false;
      var hash = latLng.toUrlValue(MapController.precision);
      var marker = this._markers[hash];
      if (marker) {
        marker.setMap(null);
        removed = true;
      }
      this._markers[hash] = null;
      return removed;
    };


    MapController.prototype.fitToMarkers = function () {
      var bounds = new google.maps.LatLngBounds();

      angular.forEach(this._markers, function (m, i) {
        bounds.extend(m.getPosition());
      });

      this._map.fitBounds(bounds);
    };

    return {
      MapController: MapController
    };
  }]);
})();

