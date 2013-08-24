'use strict';

(function () {
  angular.module('hutmap.controllers').

  controller('AlertCtrl', ['$scope', function($scope) {
    // Of the form { type: 'error/warning/info', msg: 'message' }
    $scope.alerts = [
    ];

    $scope.addAlert = function(type, msg) {
      $scope.alerts.push({type:type,msg:msg});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  }]);

})();
