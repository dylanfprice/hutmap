goog.provide('hutmap.map.Map');

goog.require('goog.array');
goog.require('goog.debug.Logger');
goog.require('goog.dom');
goog.require('goog.iter');
goog.require('goog.structs');
goog.require('goog.structs.Map');

goog.require('Wkt.Wkt');
goog.require('Wkt.gmap3');
goog.require('hutmap.History');
goog.require('hutmap.Huts');
goog.require('hutmap.map.Filter');
goog.require('hutmap.map.Sidebar');
goog.require('hutmap.map.Types');
goog.require('markerclusterer.MarkerClusterer');

/**
 * Wraps the google.maps.Map class with hutmap specific functionality.
 *
 * @param {Object} mapIds an object containing ids of elements needed by the
 *    map. This object should have the following properties: 'mapDivId',
 *    'sidebarDivId', 'sidebarContentDivid', 'sidebarToggleDivId',
 *    'sidebarToggleIconDivId', and 'filterDivId'.
 * @param {hutmap.Huts} huts 
 * @constructor
 */
hutmap.map.Map = function(mapIds, huts) {
  /**
   * Logger for the map.
   *
   * @type goog.debug.Logger
   */
  this.logger = goog.debug.Logger.getLogger('hutmap.map.Map');
  /**
   * Object containing element ids.
   *
   * @type Object
   */
  this.mapIds = mapIds;
  /**
   * Reference to the huts object which is a container for all huts currently
   * loaded.
   *
   * @type Object
   */
  this.huts = huts;
  /**
   * The google map object.
   *
   * @type google.maps.Map
   */
  this.gmap = new google.maps.Map(goog.dom.getElement(mapIds.mapDivId), {
    zoom: 3,
    center:  new google.maps.LatLng(47.6, -122.3), 
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    streetViewControl: false,
    panControl: false,
    /*
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP,
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
    },
    */
    zoomControlOptions: { 
      position: google.maps.ControlPosition.RIGHT_TOP 
    }
  }); 
  /**
   * A map from hut id to google.maps.Marker
   *
   * @type goog.structs.Map
   */
  this.markers = new goog.structs.Map();
  /**
   * A clusterer for the markers on the map.
   *
   * @type MarkerClusterer
   */
  this.markerClusterer = new MarkerClusterer(this.gmap);
  /**
   * The currently selected marker.
   *
   * @type google.maps.Marker
   */
  this.selectedMarker = null;
  /**
   * A rectangle showing the bounds of huts that are currently shown.
   *
   * @type google.maps.Rectangle
   */
  this.rectangle = new google.maps.Rectangle({
    'map': this.gmap,
    'clickable': false,
    'editable': false,
    'visible': false,
    'fillColor': 'black',
    'fillOpacity': 0.0,
    'strokeColor': 'black',
    'strokeOpacity': 0.5
  });
  /**
   * The Sidebar object which allows updating the hut display on the sidebar.
   *
   * @type Object
   */
  this.sidebar = new hutmap.map.Sidebar(mapIds.sidebarContentDivId);
  /**
   * The Filter object which allows filtering the huts displayed on the map.
   *
   * @type Object
   */
  this.filter = new hutmap.map.Filter(mapIds.filterDivId);


  // set up additional map layers
  var mapTypes = new hutmap.map.Types(this.gmap);

  this.gmap.mapTypes.set(mapTypes.MSR_TOPO.name, mapTypes.MSR_TOPO);
  this.gmap.mapTypes.set(mapTypes.ARC_GIS_USA.name, mapTypes.ARC_GIS_USA);
  this.gmap.mapTypes.set(mapTypes.ARC_GIS_WORLD.name, mapTypes.ARC_GIS_WORLD);

  this.gmap.setOptions({
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, 
                   google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.TERRAIN, 
                   mapTypes.MSR_TOPO.name, mapTypes.ARC_GIS_USA.name, 
                   mapTypes.ARC_GIS_WORLD.name]
    }
  });

  // attach listener to when new huts are loaded
  goog.events.listen(this.huts, hutmap.Huts.EventType.HUTS_CHANGED,
      goog.bind(this.onHutsChanged, this));
  
  // attach listener to hide sidebar
  var sidebarToggle = goog.dom.getElement(mapIds.sidebarToggleDivId);
  goog.events.listen(sidebarToggle, goog.events.EventType.CLICK,
      goog.bind(this.toggleSidebar, this));
};

hutmap.map.Map.RED_MARKER = 'http://maps.google.com/intl/en_us/mapfiles/ms/micons/red.png';
hutmap.map.Map.BLUE_MARKER = 'http://maps.google.com/intl/en_us/mapfiles/ms/micons/blue.png';

/**
 * Clears all hut markers from the map.
 */
hutmap.map.Map.prototype.clearHuts = function() {
  this.markerClusterer.removeMarkers(this.markers.getValues());
  this.markers.clear();
};

/**
 * Adds huts to the map. If the map already contains a given hut, will not add
 * it again.
 *
 * @param {Object[]} huts The huts to add to the map.
 */
hutmap.map.Map.prototype.addHuts = function(huts) {
  if (!goog.array.isEmpty(huts)) {
    var self = this;
    var newMarkers = [];
    goog.array.forEach(
      huts, 
      function(hut, index, array) {
        if (!this.markers.containsKey(hut.id)) {
          var position = new Wkt.Wkt(hut.location);
          var marker = position.toObject({
            visible: true,
            title: hut.name,
            icon: new google.maps.MarkerImage(hutmap.map.Map.RED_MARKER)
          });
          this.setCallbacks(marker, hut);
          this.markers.set(hut.id, marker);
          newMarkers.push(marker);
        }
      },
      self);
    this.markerClusterer.addMarkers(newMarkers);
  }
};

/**
 * Sets the callbacks that should run when the given marker is selected.
 *
 * @param {google.maps.Marker} marker A marker.
 * @param {Object} hut The hut object corresponding to the marker.
 *
 * @private
 */
hutmap.map.Map.prototype.setCallbacks = function(marker, hut) {
  var self = this;
  google.maps.event.addListener(marker, 'click', function() {
    if (self.selectedMarker != null) {
      self.selectedMarker.setIcon(new
        google.maps.MarkerImage(hutmap.map.Map.RED_MARKER));
    }

    self.selectedMarker = marker;
    marker.setIcon(new google.maps.MarkerImage(hutmap.map.Map.BLUE_MARKER));
    
    self.sidebar.setHut(hut);
  });
};

/**
 * Callback for when new huts are loaded in the this.huts object.
 *
 * @private
 */
hutmap.map.Map.prototype.onHutsChanged = function() {
  this.clearHuts();

  this.addHuts(this.huts.getHuts());
  var queryData = hutmap.History.getInstance().getHashData();
  var mapLocation = queryData.get(hutmap.consts.hk.map_location); 
  var locationMarker = null;
  if (mapLocation) {
    locationMarker = new google.maps.Marker({visible: false, position:
      this.toLatLng(mapLocation)});
    this.markerClusterer.addMarker(locationMarker);
  }

  this.markerClusterer.fitMapToMarkers();

  if (locationMarker !== null) {
    this.markerClusterer.removeMarker(locationMarker);
  }

  var bbox = queryData.get(hutmap.consts.hk.bbox);
  this.drawBounds(bbox);
};

/**
 * Adjusts the rectangle displayed on the map to match the given bounding box
 * of the form 'lat_sw'lon_sw,lat_ne,lon_ne'.
 *
 * @param {String} bbox
 *
 * @private
 */
hutmap.map.Map.prototype.drawBounds = function(bbox) {
  var bounds = this.toLatLngBounds(bbox);
  this.rectangle.setBounds(bounds);
  this.rectangle.setVisible(true);
};

/**
 * Converts a lat lon pair of the form 'lat,lon' to a google.maps.LatLng
 * object.
 *
 * @param {String} location
 * @return {google.maps.LatLng}
 *
 * @private
 */
hutmap.map.Map.prototype.toLatLng = function(location) {
  var values = goog.array.map(location.split(','),
      function(value, index, array) {
        return parseFloat(value);
      });
  var latLng = new google.maps.LatLng(values[0], values[1]);
  return latLng;
};

/**
 * Converts a bounding box of the form 'lat_sw,lon_sw,lat_ne,lon_ne' to a
 * google.maps.LatLngBounds object.
 *
 * @param {String} bbox
 * @return {google.maps.LatLngBounds}
 *
 * @private
 */
hutmap.map.Map.prototype.toLatLngBounds = function(bbox) {
  var values = goog.array.map(bbox.split(','),
      function(value, index, array) {
        return parseFloat(value);
      });
  this.logger.info(values);
  var sw = new google.maps.LatLng(values[0], values[1]);
  var ne = new google.maps.LatLng(values[2], values[3]);
  var latLngBounds = new google.maps.LatLngBounds(sw, ne);
  return latLngBounds;
};

/**
 * Hides or shows the sidebar which displays hut information.
 *
 * @private
 */
hutmap.map.Map.prototype.toggleSidebar = function() {
  this._mapRight = '';
  this._sidebarToggleRight = '';
  var map = goog.dom.getElement(this.mapIds.mapDivId);
  var sidebarToggle = goog.dom.getElement(this.mapIds.sidebarToggleDivId);
  var sidebarToggleIcon = goog.dom.getElement(this.mapIds.sidebarToggleIconDivId);
  var sidebar = goog.dom.getElement(this.mapIds.sidebarDivId);

  if (goog.style.isElementShown(sidebar)) {
    hutmap.map.mapRight = window.getComputedStyle(map).getPropertyValue('right');
    hutmap.map.sidebarToggleRight = window.getComputedStyle(sidebarToggle).getPropertyValue('right');
    map.style.right = '0px';
    sidebarToggle.style.right = '0px';
    sidebarToggle.style.cursor = 'w-resize';
    goog.dom.setTextContent(sidebarToggleIcon, '<');
    goog.style.showElement(sidebar, false);
  }
  else {
    map.style.right = this._mapRight; //'208px';
    sidebarToggle.style.right = this._sidebarToggleRight; //'200px';
    sidebarToggle.style.cursor = 'e-resize';
    goog.dom.setTextContent(sidebarToggleIcon, '>');
    goog.style.showElement(sidebar, true);
  }

  google.maps.event.trigger(map, 'resize');
};

/**
 * Callback for when the map should display a new place.
 *
 * @param {google.maps.places.PlaceGeometry} geometry A
 *   google.maps.places.PlaceGeometry or equivalent.
 */
hutmap.map.Map.prototype.placeChanged = function(geometry) {
  if (geometry.viewport) {
    this.gmap.fitBounds(geometry.viewport);
  } else {
    this.gmap.setCenter(geometry.location);
    this.gmap.setZoom(17);
  }
};

