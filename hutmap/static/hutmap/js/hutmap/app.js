(function() {
'use strict';
  
  
  angular.module('hutmap', [
      'hutmap.services', 'hutmap.directives', 'hutmap.filters', 'hutmap.controllers', 
      'ngRoute', 'ngResource', 'ngCookies',
      'AngularGM', 'ui.bootstrap', 'ui.select2', 'angularFileUpload', 'ng.django.forms',
    ]).
    

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
      }).
      when(hutmap.url.hut_new, {
        templateUrl: '/partials/hut_new.html',
        active: hutmap.url.hut_new,
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
    var base = {
      streetViewControl: false,
      panControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      },
    };

    var main = angular.extend(
      {
        zoom : 3,
        center : new google.maps.LatLng(46.87916, -120),
        mapTypeId : "World Topo",
      },
      angular.copy(base)
    );

    var form = angular.extend(
      {
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.SATELLITE
      }, 
      angular.copy(base)
    );

    return {
      main: main,
      form: form,
    };
  }]).

  factory('markerOptions', [function() {
      // marker dimensions
      var w = 17;
      var h = 17;
      var pts = [2,7,7,2,12,7,7,12,2,7];

      return {
        huts: {
          icon: {
            url: hutmap.STATIC_URL + 'hutmap/img/markers/smdot_t1_gray_dark.png',
                    size: new google.maps.Size(w, h),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(w*0.4,h*0.4)
          },
          shape: {
            coords: pts,
            type: 'poly'
          },
          zIndex: 0
        },
        filteredHuts: {
          icon: {
            url: hutmap.STATIC_URL + 'hutmap/img/markers/smdot_t1_red.png',
                    size: new google.maps.Size(w, h),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(w*0.4,h*0.4)
          },
          shape: {
            coords: pts,
            type: 'poly'
          },
          zIndex: 1
        },
        selected: {
          icon: {
            url: hutmap.STATIC_URL + 'hutmap/img/markers/smdot_t1_yellow.png',
                    size: new google.maps.Size(w, h),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(w*0.4,h*0.4)
          },
          shape: {
            coords: pts,
            type: 'poly'
          },
          zIndex: 2
        }
      };
  }]).

  run(['hutmapMapId', 'angulargmContainer', 'mapOptions',
      function(hutmapMapId, angulargmContainer, mapOptions) {

    google.maps.visualRefresh = true;

    var gmapPromise = angulargmContainer.getMapPromise(hutmapMapId);

    /**
     * Add new map types to our Google Map.
     * Add drag zoom control.
     */
    gmapPromise.then(function(gmap) {

      var getTile = {};

      /**
       * Retrieves ArcGis USA topo tiles.
       *
       * @param {google.maps.Map} gmap the google map object
       * @param {google.maps.Point} point The tile coordinate.
       * @param {number} zoom The zoom level of the map.
       * @returns {string} The URL of the needed tile.
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
        ARC_GIS_USA: new google.maps.ImageMapType({
          name: "US Topo",
          alt: "ArcGIS USA Topos",
          minZoom: 1,
          maxZoom: 15,
          tileSize: new google.maps.Size(256, 256),
          isPng: true,
          getTileUrl: getTile.ARC_GIS_USA
        }),

        ARC_GIS_WORLD: new google.maps.ImageMapType({
          name: "World Topo",
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
                       google.maps.MapTypeId.TERRAIN,
                       google.maps.MapTypeId.SATELLITE,
                       google.maps.MapTypeId.HYBRID,
                       mapTypes.ARC_GIS_USA.name,
                       mapTypes.ARC_GIS_WORLD.name],
          position: google.maps.ControlPosition.TOP_CENTER
        }
      });

      // in case mapOptions.mapTypeId didn't exist until now
      gmap.setMapTypeId(mapOptions.main.mapTypeId);
      
      gmap.enableKeyDragZoom({
        key: 'shift',
        boxStyle: {border: "2px solid grey", backgroundColor: "transparent", opacity: 0.8},
        veilStyle: {backgroundColor: "transparent", opacity: 1, cursor: "crosshair"},
        visualEnabled: true,
        visualPosition: google.maps.ControlPosition.LEFT_CENTER
      });
    });
  }]);

})();