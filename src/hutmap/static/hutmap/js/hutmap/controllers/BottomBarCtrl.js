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
    
  }]);
  
})();