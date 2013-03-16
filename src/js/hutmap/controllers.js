'use strict';

(function () {
  angular.module('hutmap').

  controller('PathCtrl', ['$scope', '$location', function($scope, $location) {
    $scope.mapPath = '/map/';

    $scope.isHutsPath = function(path) {
      return $location.path() === path;
    };
  }]).

  controller('HutCtrl', ['$scope', '$location', 'Huts', function($scope, $location, Huts) {
    $scope.huts;
    $scope.hutsMeta;
    $scope.currentQuery;

    $scope.setQuery = function(query) {
      $scope.currentQuery = query;
    };

    $scope.$watch('currentQuery', function(newQuery, oldQuery) {
      console.log(newQuery, oldQuery);
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

    $scope.$watch('$location.search()', function() {
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
    ['$scope', '$location', '$q', 'mapOptions', 'markerOptions', function ($scope, $location, $q, mapOptions, markerOptions) {
      $scope.mapOptions = mapOptions;
      $scope.markerOptions = markerOptions;
      $scope.selectedHut;
      $scope.mapLoaded = $q.defer();

      $scope.$watch('center == null && zoom == null', function() {
        if ($scope.center != null && $scope.zoom != null) {
          $scope.mapLoaded.resolve();
        }
      });

      $scope.$watch('center', function(newCenter, oldCenter) {
        if (newCenter != null && newCenter !== oldCenter) {
          $location.search('map_center', newCenter.toUrlValue());
        }
      });

      $scope.$watch('zoom', function(newZoom, oldZoom) {
        if (newZoom != null && newZoom !== oldZoom) {
          $location.search('map_zoom', newZoom);
        }
      });

      $scope.$watch('$location.search()', function() {
        var center = $location.search()['map_center'];
        var zoom = $location.search()['map_zoom'];
        $scope.mapLoaded.promise.then(function() {
          if (center != null) {
            var centerArr = center.split(',');
            $scope.center = new google.maps.LatLng(centerArr[0], centerArr[1]);
          }
          if (zoom != null) {
            $scope.zoom = Number(zoom);
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
  }]).

  controller('NavbarCtrl', ['$scope', '$window', function($scope, $window) {
    $scope.isPath = function(path) {
      var curPath = $window.location.pathname + $window.location.hash
      var index = curPath.lastIndexOf('?');
      if (index !== -1) {
        curPath = curPath.substring(0, index);
      }
      return curPath === path;
    };
  }]);
})();
