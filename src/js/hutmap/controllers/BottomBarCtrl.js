'use strict';

(function () {
  angular.module('hutmap.controllers').

  controller('BottomBarCtrl', ['$scope', function($scope) {
    $scope.accuracy_text = [
      'Unverified',
      'Wild guess',
      'Guess',
      'Found on satellite or topo',
      'Surveyed by GPS',
      'Surveyed by GPS and found on satellite or topo'  
    ];

    $scope.mouseoverHut = function(hut) {
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
