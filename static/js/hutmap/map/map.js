goog.provide('hutmap.map.Map');

goog.require('goog.array');
goog.require('goog.iter');
goog.require('goog.structs');
goog.require('goog.structs.Map');

goog.require('hutmap.Huts');
goog.require('hutmap.History');
goog.require('hutmap.map.Types');
goog.require('markerclusterer.MarkerClusterer');
goog.require('Wkt.gmap3');
goog.require('Wkt.Wkt');

/**
 * Wraps the google.maps.Map class with hutmap specific functionality.
 *
 * @param {String} mapDivId The id of the div where the map canvas should be
 *   drawn.
 * @param {hutmap.Huts} huts TODO
 * @constructor
 */
hutmap.map.Map = function(mapDivId, huts) {
  /**
   * The google map object.
   *
   * @type google.maps.Map
   */
  this.gmap = new google.maps.Map(document.getElementById(mapDivId),
      this.MAP_OPTIONS);
  /**
   *TODO
   */
  this.huts = huts;
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
   *
   */
  //this.displayedHutLimitWarning = false;
  this.locationMarker = null;

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
};

/**
 * Options for the google.maps.Map constructor.
 */
hutmap.map.Map.prototype.MAP_OPTIONS = {
  zoom: 5,
  //center: new google.maps.LatLng(48.06, -120.70),
  center: new google.maps.LatLng(62.9, 92),
  mapTypeId: google.maps.MapTypeId.TERRAIN
};

/**
 * Clears all hut markers from the map.
 */
hutmap.map.Map.prototype.clearHuts = function() {
  this.markerClusterer.removeMarkers(this.markers.getValues());
  this.markers.clear();
};

/**
 * Adds huts to the map.
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
  if (this.locationMarker !== null) {
    this.markerClusterer.removeMarker(this.locationMarker);
    this.locationMarker = null;
  }

  this.addHuts(this.huts.getHuts());
  var queryData = hutmap.History.getInstance().getHashData();
  var mapLocation = queryData.get(hutmap.consts.hk.map_location); 
  if (mapLocation) {
    this.locationMarker = new google.maps.Marker({visible: false, position:
      this.toLatLng(mapLocation)});
    this.markerClusterer.addMarker(this.locationMarker);
  }

  this.markerClusterer.fitMapToMarkers();
};

hutmap.map.Map.prototype.toLatLng = function(location) {
  var values = goog.array.map(location.split(','),
      function(value, index, array) {
        return parseFloat(value);
      });
  var latLng = new google.maps.LatLng(values[0], values[1]);
  return latLng;
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

