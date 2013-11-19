(function () {
'use strict';

  angular.module('hutmap.controllers').

  controller('HutFormCtrl', 
    ['$scope', '$modal', '$cookies', '$log',
    function($scope, $modal, $cookies, $log) {

    $scope.suggestHut = function() {

      var modal = $modal.open({
        templateUrl: 'hut_modal.html',
        controller: 'HutFormInstanceCtrl',
        keyboard: false,
        resolve: {
          hutFormUrl: function() {
            return '/forms/hut/new/';
          },
          header: function() {
            return 'Suggest new hut';
          }
        }
      });

      modal.result.then(function (hut) {
        $scope.addAlert('success', "Successfully submitted suggestion for " + hut.name + "!");
      }, function (reason) {
        $log.info(reason, 'suggestion dismissed at: ' + new Date());
      });
    };

    $scope.editHut = function (hut) {

      var modal = $modal.open({
        templateUrl: 'hut_modal.html',
        controller: 'HutFormInstanceCtrl',
        keyboard: false,
        resolve: {
          hutFormUrl: function() {
            return '/forms/hut/' + hut.id + '/';
          },
          header: function() {
            return 'Edit ' + hut.name;
          }
        }
      });

      modal.result.then(function (hut) {
        $scope.addAlert('success', "Successfully submitted edit for " + hut.name + "!");
      }, function (reason) {
        $log.info(reason, 'edit dismissed at: ' + new Date());
      });
    };

  }]);

})();
