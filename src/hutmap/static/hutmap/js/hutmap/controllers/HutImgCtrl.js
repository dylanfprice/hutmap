(function () {
'use strict';

  angular.module('hutmap.controllers').

  controller('HutImgCtrl', ['$scope', function($scope) {
    
    $scope.getObliqueImgUrl = function(hut) {
      var url = '';
      if (hut) {
        if (hut.photo) {
          url = hut.photo;
        }
        else if (hut.photo_url) {
          url = hut.photo_url;
        } 
      }
      return url;
    };
    
    $scope.getSatelliteImgUrl = function(hut, width, height) {
      var url = '';
      if (hut) {
        var zoom = 19;
        var latlng = new google.maps.LatLng(hut.location.coordinates[1], hut.location.coordinates[0]);
        var zoomPromise = $scope.getMaxZoom(latlng);
          zoomPromise.then(function(maxZoom) {
            zoom = Math.min(zoom, maxZoom);
            url = 'http://maps.googleapis.com/maps/api/staticmap' + 
              '?center=' + hut.location.coordinates[1] + '%2C' + hut.location.coordinates[0] +
              '&zoom=' + zoom +
              '&size=' + width + 'x' + height +
              '&maptype=satellite' +
              '&sensor=false' +
              '&key=' + hutmap.GOOGLE_API_KEY;       
          }); 
          return url;
      }
    };

  }]);

})();
