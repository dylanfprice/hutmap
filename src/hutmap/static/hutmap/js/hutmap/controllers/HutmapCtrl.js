'use strict';

(function () {
  angular.module('hutmap.controllers').

  controller('HutmapCtrl', 
    ['$scope', '$route', '$timeout', '$window', 'hutmapMapId',
    function($scope, $route, $timeout, $window, hutmapMapId) {

    $scope.ui = {
      $route: $route,
      showFilterSidebar: true,
      loadNewHuts: true
    };

    $scope.$watch('ui.showFilterSidebar', function() {
      // make sure the timeout is greater than the css transition time, see
      // map.less
      $timeout(function() {
        $scope.$broadcast('gmMapResize', hutmapMapId);
      }, 600);
    });

  }]);

})();
