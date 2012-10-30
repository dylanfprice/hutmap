goog.provide('hutmap.map.Map');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.iter');
goog.require('goog.structs');
goog.require('goog.structs.Map');
goog.require('goog.debug.Logger');

goog.require('hutmap.Huts');
goog.require('hutmap.History');
goog.require('hutmap.map.Types');
goog.require('markerclusterer.MarkerClusterer');
goog.require('Wkt.gmap3');
goog.require('Wkt.Wkt');

/**
 * Wraps the google.maps.Map class with hutmap specific functionality.
 *
 * @param {Object} mapIds an object containing ids of elements needed by the
 *    map. This object should have the following properties: 'mapDivId',
 *    'sidebarDivId', 'sidebarToggleDivId', and 'sidebarToggleIconDivId'.
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
   *TODO
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
    mapTypeId: google.maps.MapTypeId.TERRAIN 
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
   * A list of currently displayed InfoWindows
   *
   * @type Array
   */
  this.openInfoWindows = [];
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


  var mapTypes = new hutmap.map.Types(this.gmap);

  this.gmap.mapTypes.set(mapTypes.MSR_TOPO.name, mapTypes.MSR_TOPO);
  this.gmap.mapTypes.set(mapTypes.ARC_GIS_USA.name, mapTypes.ARC_GIS_USA);
  this.gmap.mapTypes.set(mapTypes.ARC_GIS_WORLD.name, mapTypes.ARC_GIS_WORLD);

  this.gmap.setOptions({
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP,
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, 
                   google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.TERRAIN, 
                   mapTypes.MSR_TOPO.name, mapTypes.ARC_GIS_USA.name, 
                   mapTypes.ARC_GIS_WORLD.name]
    }
  });

  goog.events.listen(this.huts, hutmap.Huts.EventType.HUTS_CHANGED,
      goog.bind(this.onHutsChanged, this));
  //google.maps.event.addListener(this.gmap, 'bounds_changed',
  //    goog.bind(this.updateHuts, this));
  
  // attach listener to hide sidebar
  var sidebarToggle = goog.dom.getElement(mapIds.sidebarToggleDivId);
  goog.events.listen(sidebarToggle, goog.events.EventType.CLICK,
      goog.bind(this.toggleSidebar, this));
};



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
        var position = new Wkt.Wkt(hut.location);
        var marker = position.toObject({
          //map: this.gmap,
          visible: true,
          title: hut.name
        });
        this.createInfoWindow(marker, hut);
        if (!this.markers.containsKey(hut.id)) {
          this.markers.set(hut.id, marker);
          newMarkers.push(marker);
        }
      },
      self);
    this.markerClusterer.addMarkers(newMarkers);
  }
};

/**
 * Creates and opens a InfoWindow on the given marker.
 *
 * @param {google.maps.Marker} marker A marker.
 * @param {Object} hut A hut object.
 * @returns {google.maps.InfoWindow} The newly created InfoWindow.
 */
hutmap.map.Map.prototype.createInfoWindow = function(marker, hut) {
  var contentString = '<div class="infowindow">';
  contentString += '<h3><a href="' + hut.hut_url + '">' + 
    hut.name + '</a></h3>';
  contentString += '<a href="' + hut.photo_url + '">';
  contentString += '<img class="infowindow" src="' + hut.photo_url + '"/><br/>';
  contentString += '</a>';
  contentString += '<br/>';
  contentString += '</div>';
  var infowindow = new google.maps.InfoWindow({
    content: contentString,
    disableAutoPan: false
  });

  var self = this;
  google.maps.event.addListener(marker, 'click', function() {
    while (self.openInfoWindows[0]) {
      self.openInfoWindows.pop().close();
    }
    infowindow.open(self.gmap, marker);
    self.openInfoWindows.push(infowindow);
  });

  return infowindow;
};

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
 */
hutmap.map.Map.prototype.drawBounds = function(bbox) {
  var bounds = this.toLatLngBounds(bbox);
  this.rectangle.setBounds(bounds);
  this.rectangle.setVisible(true);
};

/**
 * Converts a lat lon pair of the form 'lat,lon' to a google.maps.LatLng
 * object.
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

/**
 * Retrieves and displays hut markers based on the current bounds of the map.
hutmap.map.Map.prototype.updateHuts = function() {
  if (this.totalHuts < this.CONF.maxHuts) {
    var self = this;
    hutmap.ajax.getHuts({
        bbox: this.gmap.getBounds().toUrlValue(),
        '!id__in': this.cachedIds,
        limit: (this.CONF.maxHuts - this.totalHuts)
      },
      function(data) {
        var huts = data.objects;
        self.addHuts(huts);
    });
    this.displayedHutLimitWarning = false;
  } else if (!this.displayedHutLimitWarning) {
    // TODO: make nicer solution
    alert('Exceeded hut limit of ' + this.CONF.maxHuts);
    this.displayedHutLimitWarning = true;
  }
}
*/

