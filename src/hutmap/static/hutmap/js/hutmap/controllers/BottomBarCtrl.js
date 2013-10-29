(function () {
'use strict';

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
  }]);

})();
