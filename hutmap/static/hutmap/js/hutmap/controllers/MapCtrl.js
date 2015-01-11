(function () {
'use strict';

  angular.module('hutmap.controllers').

  controller('MapCtrl',
    ['$scope', '$location', '$timeout', '$q', 'utils', 'MarkerTooltip',

    function ($scope, $location, $timeout, $q, utils, MarkerTooltip) {

    var markerTooltips = {}; // map from lat lon to MarkerTooltip instance, lazy loaded

    $scope.m = {
      center: null,            // google.maps.LatLng
      zoom: null,              // integer
      bounds: null,            // google.maps.LatLngBounds
      mapTypeId: null,         // google.maps.MapTypeId
      hutMarkerEvents: null,   // see http://dylanfprice.github.io/angular-gm/docs/module-gmMarkers.html
      initialized: $q.defer(), // for proper ordering of events
    };

    // simulate a click on the selected hut
    var clickSelected = function() {
      $q.all([$scope.m.initialized.promise, $scope.h.initialized.promise]).then(function() {
        if ($scope.h.selectedHut) {
          $scope.m.hutMarkerEvents = [{
            event: 'click',
            ids: [$scope.h.selectedHut.id]
          }];
        }
      });
    };

    $scope.$watch('m.center != null && m.zoom != null', function(v) { if (v) $scope.m.initialized.resolve(); });

    $scope.$on('clickSelected', function() {
      clickSelected();
    });

    // HACK: Load all huts, then turn off hut loading.
    var loadedHuts = false;
    $scope.updateHuts = function(bounds) {
        //if (bounds && $scope.mapPage.loadNewHuts) {
        //    $scope.h.query = { bounds: bounds };
        //}
        if (!loadedHuts) {
          bounds = google.maps.LatLngBounds(google.maps.LatLng(-90,-180), google.maps.LatLng(90,180));
          $scope.h.query = { bounds: bounds };
          loadedHuts = true;
        }
    };

    $scope.showMarkerTooltip = function(marker, hut) {
      var tooltip = markerTooltips[marker.getPosition().toUrlValue()];
      if (tooltip) {
        tooltip.show();
      } else {
        var tooltip = new MarkerTooltip({
          marker: marker,
          content: hut.name,
        });
        markerTooltips[marker.getPosition().toUrlValue()] = tooltip;
      }
    };

    $scope.hideMarkerTooltip = function(marker, hut) {
      angular.forEach(markerTooltips, function(tooltip) {
        tooltip.hide();
      });
    };

    var writeLocation = function() {
      if ($scope.m.center) {
        $location.search('m_center', $scope.m.center.toUrlValue());
      }
      if ($scope.m.zoom) {
        $location.search('m_zoom', $scope.m.zoom);
      }
      if ($scope.m.mapTypeId) {
        $location.search('m_maptypeid', $scope.m.mapTypeId);
      }
    };

    var readLocation = function() {
      var center = $location.search().m_center;
      var zoom = $location.search().m_zoom;
      var bounds = $location.search().m_bounds;
      var mapTypeId = $location.search().m_maptypeid;
      
      // clear values
      $location.search('m_center', null);
      $location.search('m_zoom', null);
      $location.search('m_bounds', null);
      $location.search('m_maptypeid', null);

      $scope.m.initialized.promise.then(function() {
        var hasBounds = bounds != null;
        if (!hasBounds && center != null) {
          $scope.m.center = utils.latLngFromUrlValue(center);
        }
        if (!hasBounds && zoom != null) {
          $scope.m.zoom = Number(zoom);
        }
        if (hasBounds) {
          $scope.m.bounds = utils.boundsFromUrlValue(bounds);
        }
        var hasMapTypeId = mapTypeId != null;
        if (hasMapTypeId) {
          $scope.m.mapTypeId = mapTypeId;
        }
      });
    };

    $scope.$on('writeLocation', writeLocation);

    readLocation();
    
    var maxZoomService = new google.maps.MaxZoomService();
    $scope.getMaxZoom = function(latlng) {
      var deferred = $q.defer();
      maxZoomService.getMaxZoomAtLatLng(latlng, function(response) {
        if (response.status != google.maps.MaxZoomStatus.OK) {
          deferred.resolve(14);
        } else {
          deferred.resolve(response.zoom);
        }
      });
      return deferred.promise;
    };
    
    $scope.zoomToHut = function(hut) {
      var latlng = new google.maps.LatLng(hut.location.coordinates[1], hut.location.coordinates[0]);
      $scope.m.center = latlng;
      var zoom = 19;
      if ($scope.m.mapTypeId == google.maps.MapTypeId.HYBRID) {
        var zoomPromise = MaxZoom.getMaxZoom(latlng);
        zoomPromise.then(function(maxZoom) {
          $scope.m.zoom = Math.min(zoom, maxZoom);
        });
      } else {
        $scope.m.zoom = zoom;
      }
    };

  }]);
})();