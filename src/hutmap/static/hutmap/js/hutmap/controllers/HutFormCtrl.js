'use strict';

(function () {
  angular.module('hutmap.controllers').

  controller('HutFormCtrl', 
    ['$scope', '$modal', '$log',
    function($scope, $modal, $log) {
    
    $scope.suggestHut = function() {
      var modalInstance = $modal.open({
        templateUrl: '/forms/hut/new/',
        controller: 'HutFormInstanceCtrl',
      });

      modalInstance.result.then(function (hut) {
        $log.info('suggestion', hut);
      }, function (reason) {
        $log.info(reason, 'Modal dismissed at: ' + new Date());
      });
    };

    $scope.editHut = function (hut) {
      var modalInstance = $modal.open({
        templateUrl: '/forms/hut/' + hut.id + '/',
        controller: 'HutFormInstanceCtrl',
      });

      modalInstance.result.then(function (hut) {
        $log.info('edit', hut);
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    };
  }]);

})();
