(function () {
'use strict';

  angular.module('hutmap.controllers').

  controller('HutInfoCtrl', 
    ['$scope', 'MaxZoom', 'utils',
    function($scope, MaxZoom, utils) {
    
    $scope.accuracy_text = [
      'Unverified',
      'Wild guess',
      'Guess',
      'Surveyed by satellite',
      'Surveyed by GPS',
      'Surveyed by GPS'
    ];
    
    $scope.backcountry_text = [
      'Frontcountry',
      'Backcountry in winter only',
      'Backcountry',
      'Rugged backcountry'
    ];
    
    $scope.getHutUrls = function(hut) {
      var urls = [];
      if (hut) {
        if (hut.hut_url != "") {
          urls[0] = hut.hut_url;
        }
        urls = urls.concat(hut.hut_references);
      }
      return urls;
    };
    
    $scope.isOpenAlways = function(hut) {
      var open = null;
      if (hut) {
        open = hut.overnight && hut.open_summer && hut.open_winter;
      }
      return open;
    };
    
    $scope.getServices = function(hut) {
      var services = [];
      if (hut) {
        services = hut.services.concat(hut.optional_services);
      }
      return services;
    };
    
    $scope.zoomToHut = function(hut) {
      var latlng = utils.latLngFromHut(hut);
      var zoom = 19;
      if ($scope.map.mapTypeId == google.maps.MapTypeId.HYBRID) {
        var zoomPromise = MaxZoom.getMaxZoom(latlng);
        zoomPromise.then(function(maxZoom) {
          zoom = Math.min(zoom, maxZoom);
        });
      }
      $scope.setMap(latlng, zoom);
    };

  }]);
  
})();
