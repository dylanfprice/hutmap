'use strict';

(function () {
  angular.module('hutmap').

  controller('MapCtrl',
    ['$scope', '$timeout', function ($scope, $timeout) {

      $scope.selectedMarker;

      $scope.log = function() {
        console.log($scope);
      };

      $scope.setAnimation = function(marker, animate) {
        if (animate && marker.getAnimation() == null) {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        } else if (!animate) {
          $timeout(function() {
            marker.setAnimation(null);
          });
        }
      };

      $scope.addMarker = function($event) {
        $scope.markers.push(new google.maps.Marker({
          map: $scope.gmap,
          position: $event.latLng
        }));
      };

      $scope.setZoomMessage = function(zoom) {
        $scope.zoomMessage = 'You just zoomed to '+zoom+'!';
      };

      $scope.openMarkerInfo = function(marker) {
        $scope.currentMarker = marker;
        $scope.currentMarkerLat = marker.getPosition().lat();
        $scope.currentMarkerLng = marker.getPosition().lng();
        $scope.infoWindow.open($scope.gmap, marker);
      };

      $scope.setMarkerPosition = function(marker, lat, lng) {
        marker.setPosition(new google.maps.LatLng(lat, lng));
      };
    }]);
})();
