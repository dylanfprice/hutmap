'use strict';

(function () {
  angular.module('hutmap.controllers').

  controller('HutFormCtrl', 
    ['$scope', '$modal', '$http', '$cookies', '$log',
    function($scope, $modal, $http, $cookies, $log) {

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
        $log.info('suggestion', hut);
        $scope.addAlert('info', "Created hut suggestion '" + hut.name + "'");
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
        $log.info('edit', hut);
        $scope.addAlert('info', "Edited hut '" + hut.name + "'");
      }, function (reason) {
        $log.info(reason, 'edit dismissed at: ' + new Date());
      });
    };

  }]);

})();
