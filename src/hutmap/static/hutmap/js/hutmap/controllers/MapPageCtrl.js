(function () {
'use strict';

  angular.module('hutmap.controllers').

  /*
   * This controller handles general state for the map page.
   */
  controller('MapPageCtrl', 
    
    ['$scope', '$timeout', 'hutmapMapId',
    function ($scope, $timeout, hutmapMapId) {

    $scope.mapPage = {
      showFilterSidebar: true,
      loadNewHuts: true
    };

    $scope.$watch('mapPage.showFilterSidebar', function() {
      // make sure the timeout is greater than the css transition time, see
      // map.less
      $timeout(function() {
        $scope.$broadcast('gmMapResize', hutmapMapId);
      }, 600);
    });

  }]);
})();
