'use strict';

(function () {
  angular.module('hutmap').

  controller('MapConfigCtrl', 
    
    ['$scope', '$http', 'hutmapMapId', 'angulargmContainer', 'mapOptions',
    'markerOptions',

    function ($scope, $http, hutmapMapId, angulargmContainer, mapOptions,
      markerOptions) {

    var gmapPromise = angulargmContainer.getMapPromise(hutmapMapId);
    var prevSelectedMarker;
    var prevIcon;

    $scope.hutmapMapId = hutmapMapId;
    $scope.mapOptions = mapOptions;
    $scope.markerOptions = markerOptions;

    $scope.getMarkerOptions = function(hut) {
      var opts = {title: hut.name};
      if ($scope.filteredHuts && hut.id in $scope.filteredHutIds) {
        return angular.extend(opts, $scope.markerOptions.filteredHuts);
      } else {
        return angular.extend(opts, $scope.markerOptions.huts);
      }
    };

    $scope.selectHut = function(marker, hut) {
      if (prevSelectedMarker) {
        var opts = angular.extend({}, markerOptions.huts, {icon: prevIcon});
        prevSelectedMarker.setOptions(opts);
      }
      prevSelectedMarker = marker;
      prevIcon = marker.getIcon();
      marker.setOptions(markerOptions.selected);
      $scope.setSelectedHut(hut);
    };

    /**
     * Add new map types to our Google Map.
     * Add drag zoom control.
     */
    gmapPromise.then(function(gmap) {
      var getTile = {};

      /**
       * Function for retrieving MSR USGS topo tiles.
       *
       * @param {google.maps.Point} point The tile coordinate.
       * @param {number} zoom The zoom level of the map.
       * @returns {string} The URL of the needed tile.
       */
      getTile.MSR_TOPO = function(point, zoom) {
        var projection = gmap.getProjection();
        var h = Math.pow(2, zoom);
        var swPnt = new google.maps.Point(point.x * 256 / h, (point.y + 1) * 256 / h);
        var nePnt = new google.maps.Point((point.x + 1) * 256 / h, (point.y) * 256 / h);
        var sw = projection.fromPointToLatLng(swPnt);
        var ne = projection.fromPointToLatLng(nePnt);
        var bbox = [sw.lng(), sw.lat(), ne.lng(), ne.lat()];
        var url = "http://msrmaps.com/ogcmap.ashx?version=1.1.1&request=GetMap&Layers=drg&Styles=default&SRS=EPSG:4326&BBOX=" +
          bbox.join(',') + "&width=256&height=256&format=image/jpeg";
        return url;
      };

      /**
       * Retrieves ArcGis USA topo tiles.
       */
      getTile.ARC_GIS_USA = function(point, zoom) {
        var c = 1 << zoom,
        column = (point.x % c);
        if (column < 0) { column += c }
        var url = "http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/";
        return url + (parseInt(zoom)) + "/" + point.y + "/" + column
      };

      /**
       * Retrieves ArcGis World topo tiles.
       */
      getTile.ARC_GIS_WORLD = function(point, zoom) {
        var c = 1 << zoom,
        column = (point.x % c);
        if (column < 0) { column += c }
        var url = "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/";
        return url + (parseInt(zoom)) + "/" + point.y + "/" + column
      };


      var mapTypes = {
        MSR_TOPO: new google.maps.ImageMapType({
          name: "MSR USGS",
          alt: "USGS topos from Microsoft Research",
          minZoom: 1,
          maxZoom: 15,
          tileSize: new google.maps.Size(256, 256),
          isPng: false,
          getTileUrl: getTile.MSR_TOPO
        }),

        ARC_GIS_USA: new google.maps.ImageMapType({
          name: "ArcGIS USA",
          alt: "ArcGIS USA Topos",
          minZoom: 1,
          maxZoom: 15,
          tileSize: new google.maps.Size(256, 256),
          isPng: true,
          getTileUrl: getTile.ARC_GIS_USA
        }),

        ARC_GIS_WORLD: new google.maps.ImageMapType({
          name: "ArcGIS World",
          alt: "ArcGIS World Topos",
          minZoom: 1,
          maxZoom: 15,
          tileSize: new google.maps.Size(256, 256),
          isPng: true,
          getTileUrl: getTile.ARC_GIS_WORLD
        })
      };

      angular.forEach(mapTypes, function(mapType, key) {
        gmap.mapTypes.set(mapType.name, mapType);
      });

      gmap.setOptions({
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP,
                       google.maps.MapTypeId.SATELLITE,
                       google.maps.MapTypeId.HYBRID,
                       google.maps.MapTypeId.TERRAIN,
                       mapTypes.MSR_TOPO.name,
                       mapTypes.ARC_GIS_USA.name,
                       mapTypes.ARC_GIS_WORLD.name]
        }
      });

      gmap.enableKeyDragZoom({
        key: 'alt',
        visualEnabled: true
      });
    });
  }]);
})();
