'use strict';

(function () {
  angular.module('hutmap.controllers').

  controller('HutFormCtrl', 
    ['$scope',
    function($scope) {
    
    $scope.select2Options = {
      width: 'resolve',
      placeholderOption: 'first',
    };

    $scope.submit = function() {
      console.log(hut);
    };
  }]);

})();
