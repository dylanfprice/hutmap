(function () {
  angular.module('hutmap').

  controller('MapCtrl',
    ['$scope', '$location', '$timeout', '$q', 'googleMapsContainer',
    'hutmapMapId', 'mapOptions', 'markerOptions', 'utils',

    function ($scope, $location, $timeout, $q, googleMapsContainer,
      hutmapMapId, mapOptions, markerOptions, utils) {

    var gmapPromise = googleMapsContainer.getMapPromise(hutmapMapId);
    var scopeInitialized = $q.defer();
    var hutsInitialized = $q.defer();

    $scope.hutmapMapId = hutmapMapId;
    $scope.mapOptions = mapOptions;
    $scope.markerOptions = markerOptions;
    $scope.center;
    $scope.zoom;
    $scope.bounds;
    $scope.hutMarkerEvent;

    var updateLocation = function() {
      if ($scope.center) {
        $location.search('m_center', $scope.center.toUrlValue());
      }
      if ($scope.zoom) {
        $location.search('m_zoom', $scope.zoom);
      }
      if ($scope.selectedHut) {
        var loc = $scope.selectedHut.location;
        $location.search('m_selected', loc.lat + ',' + loc.lng);
      }
    };

    var updateScope = function() {
      var center = $location.search().m_center;
      var zoom = $location.search().m_zoom;
      var selected = $location.search().m_selected;
      scopeInitialized.promise.then(function() {
        if (center != null) {
          $scope.center = utils.latLngFromUrlValue(center);
        }
        if (zoom != null) {
          $scope.zoom = Number(zoom);
        }
      });
      hutsInitialized.promise.then(function() {
        if (selected != null) {
          $scope.hutMarkerEvent = {
            event: 'click',
            location: utils.latLngFromUrlValue(selected)
          };
        }
      });
    };

    var valueChange = function(newValue, oldValue) {
      if (newValue !== oldValue)
        updateLocation();
    };

    $scope.$watch('center != null && zoom != null', function(v) { if (v) scopeInitialized.resolve(); });
    $scope.$watch('huts != null', function(v) { if (v) hutsInitialized.resolve(); });
    $scope.$watch('center', valueChange);
    $scope.$watch('zoom', valueChange);
    $scope.$watch('selectedHut', valueChange);

    $scope.selectHut = function(marker, hut) {
      if ($scope.prevSelectedMarker) {
        $scope.prevSelectedMarker.setOptions(markerOptions.huts);
      }
      $scope.prevSelectedMarker = marker;
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
        visualEnabled: true,
      });
    });

    updateScope();

  }]);
})();
