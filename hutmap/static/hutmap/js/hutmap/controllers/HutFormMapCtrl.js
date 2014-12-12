(function () {
'use strict';

  angular.module('hutmap.controllers').

  controller('HutFormMapCtrl', 
    ['$scope', 'mapOptions', 'markerOptions',
    function($scope, mapOptions, markerOptions) {

    $scope.huts = [$scope.hut];

    $scope.markerOptions = markerOptions.filteredHuts;
    $scope.markerOptions['draggable'] = true;

    $scope.mapOptions = mapOptions.form;

    $scope.positionFromHut = function(hut) {
      if (hut != null && hut.location != null) {
        var values = hut.location.split(',');
        if (values.length == 2) {
          var lat = parseFloat(values[0]);
          var lng = parseFloat(values[1]);
          if (!isNaN(lat) && !isNaN(lng)) {
            $scope.mapCenter = new google.maps.LatLng(lat, lng);
            return {lat: lat, lng: lng};
          }
        }
      }
      return null;
    }

    $scope.positionFromMarker = function(marker, hut) {
      $scope.hut.location = marker.getPosition().toUrlValue();
    }

    $scope.updateMarker = function() {
        $scope.$broadcast('gmMarkersUpdate', 'huts');
    }

  }]);

})();
