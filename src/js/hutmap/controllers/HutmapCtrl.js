'use strict';

(function () {
  angular.module('hutmap.controllers').

  controller('HutmapCtrl', 
    ['$scope', '$route', function($scope, $route) {

    $scope.$route = $route;

    $scope.filterSidebarHidden = false;
    $scope.setFilterSidebarHidden = function(filterSidebarHidden) {
      $scope.filterSidebarHidden = filterSidebarHidden;
    };

    $scope.$watch('filterSidebarHidden', function() {
      $scope.$broadcast('gmapResized');
    });

  }]);

})();
