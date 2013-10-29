(function () {
'use strict';

  angular.module('hutmap.controllers').

  controller('HutmapCtrl', 
    ['$scope', '$timeout', '$route', 'hutmapMapId',
    function($scope, $timeout, $route, hutmapMapId) {

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
