'use strict';

(function () {
  angular.module('google-maps').

  /**
   * Directive controller which is owned by the googleMap directive and shared
   * among all other google maps directives.
   */
  factory('googleMapControllerFactory', ['googleMapsUtils', 'googleMapsDefaults', 'googleMapsContainer',
    function (googleMapsUtils, googleMapsDefaults, googleMapsContainer) {

    /** aliases */
    var latLngEqual = googleMapsUtils.latLngEqual;
    var boundsEqual = googleMapsUtils.boundsEqual;
    var latLngToObj = googleMapsUtils.latLngToObj;
    var hasNaN = googleMapsUtils.hasNaN;
    var gMDefaults = googleMapsDefaults;
    var gMContainer = googleMapsContainer;


    /** MapController class **/
    
    /* 
     * Construct a new controller for the googleMap directive.
     * @param {angular.Scope} $scope
     * @param {angular.element} $element
     * @param {angular.Attributes} $attrs
     * @constructor
     */
    var MapController = function($scope, $element, $attrs) {

      var mapId = $attrs.mapId;
      if (!mapId) { throw 'googleMap must have non-empty mapId attribute'; }

      var mapDiv = $element.find('[id]');
      mapDiv.attr('id', mapId);

      var config = this._getConfig($scope, gMDefaults);

      // 'private' properties
      this._map = this._createMap(mapId, mapDiv, config, gMContainer);
      this._markers = {};

      // 'public' properties
      this.dragging = false;

      Object.defineProperty(this, 'center', {
        get: function() {
               return this._map.getCenter();
             },
        set: function(center) {
               if (hasNaN(center)) 
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
               var numbers = !hasNaN(bounds.getSouthWest()) &&
                             !hasNaN(bounds.getNorthEast());
               if (!numbers) 
                 throw 'bounds contains null or NaN';

               var changed = !(boundsEqual(this.bounds, bounds));
               if (changed) {
                 this._map.fitBounds(bounds);
               }
             }
      });

      this._initDragListeners();
    };


    // Constant for toUrlValue() of google.maps.LatLng
    // used for hashing LatLng objects
    MapController.precision = 3;


    // Retrieve google.maps.MapOptions
    MapController.prototype._getConfig = function($scope, gMDefaults) {
      // Get config or defaults
      var defaults = gMDefaults.mapOptions;
      var config = {};
      angular.extend(config, defaults, $scope.mapOptions());
      return config;
    };


    // Create the map and add to googleMapsContainer
    MapController.prototype._createMap = function(id, element, config, gMContainer) {
      var map = gMContainer.getMap(id);
      if (!map) {
        map = new google.maps.Map(element[0], config);
        gMContainer.addMap(id, map);
      } else {
        throw 'A map with id ' + id + ' already exists. You must use' +
          ' different ids for each instance of the googleMap directive.';
      }
      return map;
    };

        
    // Set up listeners to update this.dragging
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

    
    /**
     * Alias for google.maps.Map.addListener
     * @param {string} event an event defined on google.maps.Map
     * @param {function} a handler for the event
     */
    MapController.prototype.addListener = function(event, handler) {
      google.maps.event.addListener(this._map, 
          event, handler);
    };


    /**
     * Alias for google.maps.Map.addListenerOnce
     * @param {string} event an event defined on google.maps.Map
     * @param {function} a handler for the event
     */
    MapController.prototype.addListenerOnce = function(event, handler) {
      google.maps.event.addListenerOnce(this._map, 
          event, handler);
    };


    /**
     * Adds a new marker to the map.
     * @param {google.maps.MarkerOptions} markerOptions
     * @return {boolean} true if a marker was added, false if there was already
     *   a marker at this position. 'at this position' means delta_lat and
     *   delta_lng are < 0.0005
     * @throw if markerOptions does not have all required options (i.e. position)
     */
    MapController.prototype.addMarker = function(markerOptions) {
      var opts = {};
      angular.extend(opts, markerOptions);

      if (!(opts.position instanceof google.maps.LatLng)) {
        throw 'markerOptions did not contain a position';
      }

      var marker = new google.maps.Marker(opts);
      var position = marker.getPosition();
      if (this.hasMarker(position.lat(), position.lng())) {
        return false;
      }
      
      var hash = position.toUrlValue(MapController.precision);
      this._markers[hash] = marker;
      marker.setMap(this._map);
      return true;
    };      


    /**
     * @param {number} lat
     * @param {number} lng
     * @return {boolean} true if there is a marker with the given lat and lng
     */
    MapController.prototype.hasMarker = function(lat, lng) {
      return (this.getMarker(lat, lng) instanceof google.maps.Marker);
    };


    /**
     * @param {number} lat
     * @param {number} lng
     * @return {google.maps.Marker} the marker at given lat and lng, or null if
     *   no such marker exists
     */
    MapController.prototype.getMarker = function (lat, lng) {
      if (lat == null || lng == null)
        throw 'lat or lng was null';

      var latLng = new google.maps.LatLng(lat, lng);
      var hash = latLng.toUrlValue(MapController.precision);
      if (hash in this._markers) {
        return this._markers[hash];
      } else {
        return null;
      }
    };  


    /**
     * @param {number} lat
     * @param {number} lng
     * @return {boolean} true if a marker was removed, false if nothing
     *   happened
     */
    MapController.prototype.removeMarker = function(lat, lng) {
      if (lat == null || lng == null)
        throw 'lat or lng was null';

      var latLng = new google.maps.LatLng(lat, lng);

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


    /**
     * Changes bounds of map to view all markers.
     *
     * Note: after calling this function, this.bounds, this.center, and
     * this.zoom may temporarily be null as the map moves. Therefore, use
     * this.addListenerOnce if you need to access these values immediately
     * after calling fitToMarkers.
     */
    MapController.prototype.fitToMarkers = function () {
      var bounds = new google.maps.LatLngBounds();

      this.forEachMarker(function(marker) {
        bounds.extend(marker.getPosition());
      });

      this._map.fitBounds(bounds);
    };


    /**
     * Applies a function to each marker.
     * @param {function} fn
     * @throw if fn is null or undefined
     */
    MapController.prototype.forEachMarker = function(fn) {
      if (fn == null) { throw 'fn was null or undefined'; };
      angular.forEach(this._markers, function(marker, hash) {
        fn(marker);
      });
    };


    return {
      MapController: MapController
    };

  }]);
})();

