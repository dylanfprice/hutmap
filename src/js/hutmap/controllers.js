'use strict';

(function () {
  angular.module('hutmap').

  controller('RouteCtrl', ['$scope', '$route', '$location', '$timeout', 'googleMapsContainer', function($scope, $route, $location, $timeout, googleMapsContainer) {
    $scope.$route = $route;

  }]).

  controller('HutCtrl', ['$scope', '$location', 'Huts', function($scope, $location, Huts) {
    $scope.huts;
    $scope.hutsById;
    $scope.hutsMeta;
    $scope.currentQuery;

    $scope.setQuery = function(query) {
      $scope.currentQuery = query;
    };

    $scope.$watch('currentQuery', function(newQuery, oldQuery) {
      if (newQuery != null && newQuery !== oldQuery) {
        var hutQuery = Huts.query(newQuery, function() {
          $scope.huts = hutQuery.objects;
          $scope.hutsMeta = hutQuery.meta;
        });
        angular.forEach(newQuery, function(value, key) {
          $location.search(key, value);
        });
      }
    }, true);

    $scope.$on('$routeChangeSuccess', function() {
      var search = $location.search();
      var newQuery = {};
      var shouldUpdate = false;
      angular.forEach(search, function(value, key) {
        if (key.lastIndexOf('map', 0) !== 0) {
          newQuery[key] = value;
          shouldUpdate = true;
        }
      });
      if (shouldUpdate) {
        $scope.currentQuery = newQuery;
      }
    });

    $scope.$watch('hutsMeta.total_count', function(newValue, oldValue, scope) {
      if (newValue) {
        console.log(newValue);
      }
    });
  }]).

  controller('MapCtrl',
    ['$scope', '$location', '$timeout', '$route', 'googleMapsContainer',
    'hutmapMapId', 'mapOptions', 'markerOptions', 'utils',

    function ($scope, $location, $timeout, $route, googleMapsContainer,
      hutmapMapId, mapOptions, markerOptions, utils) {

    $scope.hutmapMapId = hutmapMapId;
    $scope.mapOptions = mapOptions;
    $scope.markerOptions = markerOptions;
    $scope.selectedHut;

    $scope.updateLocation = function() {
      if ($route.current.activetab == 'map') {
        if ($scope.center) {
          $location.search('map_center', $scope.center.toUrlValue());
        }
        if ($scope.zoom) {
          $location.search('map_zoom', $scope.zoom);
        }
        if ($scope.selectedHut) {
          var loc = $scope.selectedHut.location;
          $location.search('map_selected', loc.lat + ',' + loc.lng);
        }
      }
    };

    $scope.$watch('center', function(newCenter, oldCenter) {
      if (newCenter !== oldCenter) {
        $scope.updateLocation();
      }
    });

    $scope.$watch('zoom', function(newZoom, oldZoom) {
      if (newZoom !== oldZoom) {
        $scope.updateLocation();
      }
    });

    $scope.$watch('selectedHut', function(newHut, oldHut) {
      if (newHut !== oldHut) {
        $scope.updateLocation();
      }
    });

    var gmapPromise = googleMapsContainer.getMapPromise(hutmapMapId);
    var mapResized = false;

    $scope.$on('$routeChangeSuccess', function($event, current, previous) {

      var isMap = current && current.activetab == 'map';
      var wasMap = previous && previous.activetab == 'map';

      if (isMap && !wasMap) {
        if (!mapResized) {
          mapResized = true;
          gmapPromise.then(function(gmap) {
            $timeout(function() {
              google.maps.event.trigger(gmap, 'resize');
              gmap.setCenter($scope.center);
            });
          });
        }
      }

      if (isMap) {
        var center = $location.search().map_center;
        var zoom = $location.search().map_zoom;
        gmapPromise.then(function() {
          if (center != null) {
            $scope.center = utils.latLngFromUrlValue(center);
          }
          if (zoom != null) {
            $scope.zoom = Number(zoom);
          }
        });
      }
    });

    $scope.$watch('huts', function() {
      var selected_loc = $location.search().map_selected;
      gmapPromise.then(function(gmap) {
        if (selected_loc != null) {
          $scope.hutMarkerEvent = {
            event: 'click',
            location: utils.latLngFromUrlValue(selected_loc)
          };
        }
      });
    });

    $scope.selectHut = function(marker, hut) {
      if ($scope.prevSelectedMarker) {
        $scope.prevSelectedMarker.setOptions(markerOptions.huts);
      }
      $scope.prevSelectedMarker = marker;
      marker.setOptions(markerOptions.selected);
      $scope.selectedHut = hut;
    };
  }]).

  controller('HutInfoCtrl', ['$scope', function($scope) {
    $scope.accuracy_tooltip = [
      'Coordinates provided, but unverifiable.',
      'Wild ass guess.',
      'Slightly better than a wild ass guess.',
      'Found structure on satellite or topo map.',
      'Surveyed with GPS by the Hutmap team.',
      'Found on a map and surveyed by the Hutmap team.'  
    ];
  }]);

})();
