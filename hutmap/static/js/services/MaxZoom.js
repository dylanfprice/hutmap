(function () {
'use strict';

  angular.module('hutmap.services').

  // access the google.maps.MaxZoomService
  provider('MaxZoom', [function() {
    var MaxZoomProvider = {}
    var defaultMaximumZoom = 19;

    MaxZoomProvider.$get = ['$q', function($q) {
      var MaxZoom = {};
      var maxZoomService = new google.maps.MaxZoomService();

      MaxZoom.getMaxZoom = function(latLng) {
        var deferred = $q.defer();
        maxZoomService.getMaxZoomAtLatLng(latLng, function(response) {
          if (response.status != google.maps.MaxZoomStatus.OK) {
            deferred.resolve(defaultMaximumZoom);
          } else {
            deferred.resolve(response.zoom);
          }
        });
        return deferred.promise;
      }

      return MaxZoom;
    }];

    return MaxZoomProvider;
  }]);

})();
