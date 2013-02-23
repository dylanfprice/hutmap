//goog.provide('hutmap.map.Types')

/**
 * Defines custom map types which can be displayed on a google map.
 *
 * @param {Object} gmap A google.maps.Map object.
 */
hutmap.map.Types = function(gmap) {
  this.gmap = gmap;

  this.MSR_TOPO = new google.maps.ImageMapType({
    name: "MSR-USGS",
    alt: "USGS topos from Microsoft Research",
    minZoom: 1,
    maxZoom: 20,
    tileSize: new google.maps.Size(256, 256),
    isPng: false,
    getTileUrl: goog.bind(this.msrToposGetTile, this)
  });

  this.ARC_GIS_USA = new google.maps.ImageMapType({
    name: "ArcGisUSA",
    alt: "ArcGis USA Topos",
    minZoom: 1,
    maxZoom: 15,
    tileSize: new google.maps.Size(256, 256),
    isPng: true,
    getTileUrl: this.arcGisUSAGetTile
  });

  this.ARC_GIS_WORLD = new google.maps.ImageMapType({
    name: "ArcGisWorld",
    alt: "ArcGis World Topos",
    minZoom: 1,
    maxZoom: 15,
    tileSize: new google.maps.Size(256, 256),
    isPng: true,
    getTileUrl: this.arcGisWorldGetTile
  });

};

/**
 * Function for retrieving MSR USGS topo tiles.
 *
 * @param {google.maps.Point} point The tile coordinate.
 * @param {number} zoom The zoom level of the map.
 * @returns {string} The URL of the needed tile.
 */
hutmap.map.Types.prototype.msrToposGetTile = function(point, zoom) {
  var projection = this.gmap.getProjection();
  var h = Math.pow(2, zoom);
  var swPnt = new google.maps.Point(point.x * 256 / h, (point.y + 1) * 256 / h);
  var nePnt = new google.maps.Point((point.x + 1) * 256 / h, (point.y) * 256 / h);
  var sw = projection.fromPointToLatLng(swPnt);
  var ne = projection.fromPointToLatLng(nePnt);
  var bbox = [sw.lng(), sw.lat(), ne.lng(), ne.lat()];
  var url =
    "http://msrmaps.com/ogcmap.ashx?version=1.1.1&request=GetMap&Layers=drg&Styles=default&SRS=EPSG:4326&BBOX="
    + bbox.join(',') + "&width=256&height=256&format=image/jpeg";
  return url;
};

/**
 * Function for retrieving ArcGis USA topo tiles.
 */
hutmap.map.Types.prototype.arcGisUSAGetTile = function(point, zoom) {
 var c = 1 << zoom,
     column = (point.x % c);
  if (column < 0) {
      column += c
  }
  var url = "http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/";
  return url + (parseInt(zoom)) + "/" + point.y + "/" + column
};

/**
 * Function for retrieving ArcGis World topo tiles.
 */
hutmap.map.Types.prototype.arcGisWorldGetTile = function(point, zoom) {
  var c = 1 << zoom,
      column = (point.x % c);
  if (column < 0) {
      column += c
  }
  var url = "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/";
  return url + (parseInt(zoom)) + "/" + point.y + "/" + column
};

