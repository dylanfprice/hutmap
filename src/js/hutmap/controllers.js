'use strict';

(function () {
  angular.module('hutmap').

  controller('HutCtrl', ['$scope', 'Huts', function($scope, Huts) {
    $scope.huts;
    $scope.hutsMeta;

    var hutQuery = Huts.query({limit: 50}, function() {
      $scope.huts = hutQuery.objects;
      $scope.hutsMeta = hutQuery.meta;
    });

    $scope.$watch('hutsMeta.total_count', function(newValue, oldValue, scope) {
      if (newValue) {
        console.log(newValue);
      }
    });
  }]).

  controller('MapCtrl',
    ['$scope', 'mapOptions', 'markerOptions', function ($scope, mapOptions, markerOptions) {
      $scope.mapOptions = mapOptions;
      $scope.markerOptions = markerOptions;

      $scope.selectedHut;

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
      return $window.location.pathname === path;
    };
  }]);
})();
