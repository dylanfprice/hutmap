'use strict';

(function () {
  angular.module('hutmap.controllers').

  controller('HutInfoCtrl', ['$scope', function($scope) {
    $scope.accuracy_tooltip = [
      'Coordinates provided, but unverifiable.',
      'Wild ass guess.',
      'Slightly better than a wild ass guess.',
      'Found structure on satellite or topo map.',
      'Surveyed with GPS by the Hutmap team.',
      'Found on a map and surveyed by the Hutmap team.'  
    ];

    $scope.mouseoverHut = function(hut) {
      console.log('here');
      $scope.setHutMarkerEvents([{
        event: 'mouseover',
        locations: [new google.maps.LatLng(hut.location.coordinates[1], hut.location.coordinates[0])]
      }]);
    };

    $scope.mouseoutHut = function(hut) {
      $scope.setHutMarkerEvents([{
        event: 'mouseout',
        locations: [new google.maps.LatLng(hut.location.coordinates[1], hut.location.coordinates[0])]
      }]);
    };

    $scope.clickHut = function(hut) {
      $scope.setHutMarkerEvents([{
        event: 'click',
        locations: [new google.maps.LatLng(hut.location.coordinates[1], hut.location.coordinates[0])]
      }]);
    };

  }]);

})();
