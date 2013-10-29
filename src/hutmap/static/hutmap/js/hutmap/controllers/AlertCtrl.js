'use strict';

(function () {
  angular.module('hutmap.controllers').

  controller('AlertCtrl', ['$scope', '$timeout', function($scope, $timeout) {
    // Of the form { type: 'error/warning/info', msg: 'message' }
    $scope.alerts = [
    ];

    $scope.addAlert = function(type, msg) {
      var length = $scope.alerts.push({type:type,msg:msg});
      if (type === 'info') {
        $timeout(function() {
          // race condition!
          if ($scope.alerts.length === length) {
            $scope.alerts.splice(length - 1, 1);
          }
        }, 6000);
      }
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  }]);

})();
