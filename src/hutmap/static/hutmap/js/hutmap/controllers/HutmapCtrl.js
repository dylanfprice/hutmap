(function () {
'use strict';

  angular.module('hutmap.controllers').

  controller('HutmapCtrl', 
    ['$scope', '$route',
    function($scope, $route) {

    $scope.ui = {
      $route: $route,
    };

  }]);

})();
