'use strict';

(function () {
  angular.module('hutmap.controllers').

  controller('HutFormInstanceCtrl', 
    ['$scope', '$modalInstance',
    function($scope, $modalInstance) {
    
    $scope.hut = {};

    $scope.select2Options = {
      width: 'resolve',
      placeholderOption: 'first',
    };

    $scope.submit = function () {
      $modalInstance.close($scope.hut);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);

})();
