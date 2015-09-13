(function () {
'use strict';

  angular.module('hutmap.controllers').

  controller('MapCtrl',
    ['$scope', '$location', '$timeout', '$q', 'utils', 'MarkerTooltip',
    function ($scope, $location, $timeout, $q, utils, MarkerTooltip) {

    var markerTooltips = {}; // map from lat lon to MarkerTooltip instance, lazy loaded

    // simulate a click on the selected hut
    var clickSelected = function() {
      $q.all([$scope.map.initialized.promise, $scope.h.initialized.promise]).then(function() {
        if ($scope.h.selectedHut) {
          $scope.map.hutMarkerEvents = [{
            event: 'click',
            ids: [$scope.h.selectedHut.id]
          }];
        }
      });
    };

    $scope.$watch('map.center != null && map.zoom != null', function(v) { if (v) $scope.map.initialized.resolve(); });

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
      if ($scope.map.center) {
        $location.search('m_center', $scope.map.center.toUrlValue());
      }
      if ($scope.map.zoom) {
        $location.search('m_zoom', $scope.map.zoom);
      }
      if ($scope.map.mapTypeId) {
        $location.search('m_maptypeid', $scope.map.mapTypeId);
      }
    };

    $scope.$on('writeLocation', writeLocation);

  }]);
})();
