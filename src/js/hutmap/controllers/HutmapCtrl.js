'use strict';

(function () {
  angular.module('hutmap.controllers').

  controller('HutmapCtrl', 
    ['$scope', '$route', '$timeout', 
    function($scope, $route, $timeout) {

    $scope.$route = $route;

    $scope.ui = {
      showFilterSidebar: true
    };

    $scope.$watch('ui.showFilterSidebar', function() {
      // make sure the timeout is greater than the css transition time, see
      // map.less
      $timeout(function() {
        $scope.$broadcast('gmapResized');
      }, 600);
    });

  }]);

})();
