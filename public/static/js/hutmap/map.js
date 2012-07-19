goog.provide('hutmap.Map');

goog.require('goog.array');
goog.require('goog.structs');
goog.require('goog.structs.Map');
goog.require('hutmap.ajax');
goog.require('Wkt.Wkt');
goog.require('Wkt.gmap3');

hutmap.Map = function(mapDivId) {
  this.gmap = new google.maps.Map(document.getElementById(mapDivId),
      hutmap.Map.MAP_OPTIONS);
  this.markers = new goog.structs.Map();
  this.openInfoWindows = [];
};

hutmap.Map.MAP_OPTIONS = {
  zoom: 5,
  center: new google.maps.LatLng(48.06, -120.70),
  mapTypeId: google.maps.MapTypeId.TERRAIN
};

hutmap.Map.prototype.addHuts = function(huts) {
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

hutmap.Map.prototype.createInfoWindow = function(marker, hut) {
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

hutmap.Map.prototype.clearHuts = function() {
  goog.structs.forEach(
      this.markers,
      function(value, key, collection) {
        value.setMap(null);
      });
  this.markers.clear();
};

hutmap.Map.prototype.placeChanged = function(placeResult) {
  if (placeResult.geometry == undefined) {
    console.log('placeResult.geometry undefined');
    return;
  }

  if (placeResult.geometry.viewport) {
    this.gmap.fitBounds(placeResult.geometry.viewport);
  } else {
    this.gmap.setCenter(placeResult.geometry.location);
    this.gmap.setZoom(17);
  }
};

hutmap.Map.prototype.updateHuts = function() {
  //this.clearHuts();
  var self = this;
  hutmap.ajax.getHuts({
      bbox: this.gmap.getBounds().toUrlValue()
    },
    function(data) {
      var huts = data.objects;
      self.addHuts(huts);
  });
}
