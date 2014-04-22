(function () {
'use strict';

  angular.module('hutmap.controllers').

  controller('BottomBarCtrl', ['$scope', function($scope) {
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
    
  }]);
  
})();