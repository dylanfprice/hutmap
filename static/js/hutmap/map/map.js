goog.provide('hutmap.map.Map');

goog.require('goog.array');
goog.require('goog.structs');
goog.require('goog.structs.Map');
goog.require('hutmap.ajax');
goog.require('hutmap.map.Types');
goog.require('Wkt.Wkt');
goog.require('Wkt.gmap3');

/**
 * Wraps the google.maps.Map class with hutmap specific functionality.
 *
 * @param {String} mapDivId The id of the div where the map canvas should be
 *   drawn.
 * @constructor
 */
hutmap.map.Map = function(mapDivId) {
  this.gmap = new google.maps.Map(document.getElementById(mapDivId),
      hutmap.map.Map.MAP_OPTIONS);
  this.markers = new goog.structs.Map();
  this.openInfoWindows = [];

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

  google.maps.event.addListener(this.gmap, 'bounds_changed', this.updateHuts);
};

/**
 * Options for the google.maps.Map constructor.
 */
hutmap.map.Map.MAP_OPTIONS = {
  zoom: 5,
  //center: new google.maps.LatLng(48.06, -120.70),
  center: new google.maps.LatLng(62.9, 92),
  mapTypeId: google.maps.MapTypeId.TERRAIN
};

/**
 * Adds huts to the map.
 *
 * @param {Object[]} huts The huts to add to the map.
 */
hutmap.map.Map.prototype.addHuts = function(huts) {
  var self = this;
  goog.array.forEach(
    huts, 
    function(hut, index, array) {
      var position = new Wkt.Wkt(hut.location);
      var marker = position.toObject({
        map: this.gmap,
        visible: true,
        title: hut.name
      });
      this.markers.set(hut.id, marker);
      this.createInfoWindow(marker, hut);
    },
    self);
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

/**
 * Clears all hut markers from the map.
 */
hutmap.map.Map.prototype.clearHuts = function() {
  goog.structs.forEach(
      this.markers,
      function(value, key, collection) {
        value.setMap(null);
      });
  this.markers.clear();
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
 */
hutmap.map.Map.prototype.updateHuts = function() {
  var self = this;
  hutmap.ajax.getHuts({
      bbox: this.gmap.getBounds().toUrlValue()
    },
    function(data) {
      var huts = data.objects;
      self.addHuts(huts);
  });
}
