'use strict';

(function() {
  angular.module('hutmap', ['hutmap.services', 'hutmap.directives',
    'hutmap.filters', 'hutmap.controllers', 'AngularGM', 'ngResource',
    'ui.bootstrap']).

  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when(hutmap.url.home, {
        templateUrl: '/partials/home.html',
        active: hutmap.url.home,
      }).
      when(hutmap.url.map, {
        templateUrl: '/partials/map.html',
        active: hutmap.url.map,
        reloadOnSearch: false,
      }).
      when(hutmap.url.about, {
        templateUrl: '/partials/about.html',
        active: hutmap.url.about,
      });
  }]).

  config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
  }]).

  config(['PlacesProvider', function(PlacesProvider) {
    // suggest bounds for our search results
    PlacesProvider.bounds(new google.maps.LatLngBounds(
        new google.maps.LatLng(30, -130),
        new google.maps.LatLng(65, -80)));
  }]).

  config(['gapiProvider', function(gapiProvider) {
    gapiProvider.apiKey(hutmap.GOOGLE_API_KEY);
  }]).

  config(['$interpolateProvider', function($interpolateProvider) {
    $interpolateProvider.startSymbol('[*');
    $interpolateProvider.endSymbol('*]');
  }]).

  constant('hutmapMapId', 'map_canvas').

  factory('mapOptions', [function() {
    return {
      zoom : 3,
      center : new google.maps.LatLng(46.87916, -120),
      mapTypeId : "ArcGIS World",
      streetViewControl: false,
      panControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      },
    };
  }]).

  value('markerOptions', {
    huts: {
      icon: hutmap.STATIC_URL + 'hutmap/img/marker_gray_small.png',
      shape: {
        coord: [6, 0, 2, 2, 0, 6, 6, 13, 12, 6, 10, 2, 6, 0],
        type: 'poly'
      },
      zIndex: 0
    },
    filteredHuts: {
      icon: hutmap.STATIC_URL + 'hutmap/img/marker_red_small.png',
      shape: {
        coord: [6, 0, 2, 2, 0, 6, 6, 13, 12, 6, 10, 2, 6, 0],
        type: 'poly'
      },
      zIndex: 1
    },
    selected: {
      icon: hutmap.STATIC_URL + 'hutmap/img/marker_yellow_small.png',
      zIndex: 2
    }
  }).

  run(['hutmapMapId', 'angulargmContainer', 'mapOptions',
      function(hutmapMapId, angulargmContainer, mapOptions) {

    var gmapPromise = angulargmContainer.getMapPromise(hutmapMapId);

    /**
     * Add new map types to our Google Map.
     * Add drag zoom control.
     */
    gmapPromise.then(function(gmap) {

      var getTile = {};

      /**
       * Function for retrieving MSR USGS topo tiles. 
       *
       * @param {google.maps.Map} gmap the google map object
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

      // in case mapOptions.mapTypeId didn't exist until now
      gmap.setMapTypeId(mapOptions.mapTypeId);

      gmap.enableKeyDragZoom({
        key: 'alt',
        veilStyle: {backgroundColor: "gray", opacity: 0, cursor: "crosshair"},
        visualEnabled: true,
        visualPosition: google.maps.ControlPosition.LEFT_CENTER
      });
    });
  }]);

})();
