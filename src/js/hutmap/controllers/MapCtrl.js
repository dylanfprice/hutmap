'use strict';

(function () {
  angular.module('hutmap').

  controller('MapCtrl',
    ['$scope', '$location', '$timeout', '$q', 'utils',

    function ($scope, $location, $timeout, $q, utils) {

    var scopeInitialized = $q.defer();
    var hutsInitialized = $q.defer();

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

    var clickSelected = function() {
      hutsInitialized.promise.then(function() {
        $scope.setSelectedHut(null);
        var selected = $location.search().m_selected;
        if (selected != null) {
          $scope.hutMarkerEvent = {
            event: 'click',
            location: utils.latLngFromUrlValue(selected)
          };
        }
      });
    };

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

      clickSelected();
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
    $scope.$watch('bounds', function(bounds) {
      if (bounds) {
        $scope.setQuery({
          bbox: bounds.toUrlValue(),
          limit: 0
        });
      }
    });
    $scope.$watch('huts', function(huts) {
      if (huts) { clickSelected(); }
    });

    updateScope();

  }]);
})();
