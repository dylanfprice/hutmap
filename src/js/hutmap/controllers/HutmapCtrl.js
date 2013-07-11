'use strict';

(function () {
  angular.module('hutmap.controllers').

  controller('HutmapCtrl', 
    ['$scope', '$route', '$timeout', 
    function($scope, $route, $timeout) {

    $scope.$route = $route;

    $scope.filterSidebarHidden = false;
    $scope.setFilterSidebarHidden = function(filterSidebarHidden) {
      $scope.filterSidebarHidden = filterSidebarHidden;
    };

    $scope.$watch('filterSidebarHidden', function() {
      // make sure the timeout is greater than the css transition time, see
      // map.less
      $timeout(function() {
        $scope.$broadcast('gmapResized');
      }, 600);
    });

  }]);

})();
