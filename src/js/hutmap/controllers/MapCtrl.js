'use strict';

(function () {
  angular.module('hutmap.controllers').

  controller('MapCtrl',
    ['$scope', '$location', '$timeout', '$q', 'utils', 'MarkerTooltip',

    function ($scope, $location, $timeout, $q, utils, MarkerTooltip) {

    var scopeInitialized = $q.defer(); // for proper ordering of events
    var hutsInitialized = $q.defer();  // for proper ordering of events
    var markerTooltips = {}; // map from lat lon to MarkerTooltip instance, lazy loaded

    $scope.center; // google.maps.LatLng
    $scope.zoom;   // integer
    $scope.bounds; // google.maps.LatLngBounds
    $scope.hutMarkerEvents; // see http://dylanfprice.github.io/angular-gm/docs/module-gmMarkers.html

    // simulate a click on the selected hut
    var clickSelected = function() {
      $q.all([scopeInitialized.promise, hutsInitialized.promise]).then(function() {
        if ($scope.selectedHut) {
          $scope.hutMarkerEvents = [{
            event: 'click',
            locations: [utils.latLngFromHut($scope.selectedHut)]
          }];
        }
      });
    };

    $scope.$watch('center != null && zoom != null', function(v) { if (v) scopeInitialized.resolve(); });
    $scope.$watch('huts != null', function(v) { if (v) hutsInitialized.resolve(); });
    $scope.$watch('bounds', function(bounds) {
      if (bounds && $scope.loadNewHuts) {
        $scope.setQuery({
          bounds: bounds
        });
      }
    });

    $scope.$on('gmMarkersUpdated', function(event, objects) {
      if (objects === 'huts') {
        clickSelected();
      }
    });

    $scope.$on('clickSelected', function() {
      clickSelected();
    });

    // for child scopes
    $scope.setHutMarkerEvents = function(hutMarkerEvents) {
      $scope.hutMarkerEvents = hutMarkerEvents;
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
 
    // update browser url from scope
    $scope.$on('updateLocation', function() {
      if ($scope.center) {
        $location.search('m_center', $scope.center.toUrlValue());
      }
      if ($scope.zoom) {
        $location.search('m_zoom', $scope.zoom);
      }
    });

    // update scope from browser url
    var updateScope = function() {
      // get values
      var center = $location.search().m_center;
      var zoom = $location.search().m_zoom;
      var bounds = $location.search().m_bounds;
      
      // clear values
      $location.search('m_center', null);
      $location.search('m_zoom', null);
      $location.search('m_bounds', null);

      scopeInitialized.promise.then(function() {
        var hasBounds = bounds != null;
        if (!hasBounds && center != null) {
          $scope.center = utils.latLngFromUrlValue(center);
        }
        if (!hasBounds && zoom != null) {
          $scope.zoom = Number(zoom);
        }
        if (hasBounds) {
          $scope.bounds = utils.boundsFromUrlValue(bounds);
        }
      });
    };

    // we update scope from browser url once, at beginning
    updateScope();

  }]);
})();
