(function () {
'use strict';

  angular.module('hutmap.controllers').

  controller('HutFormCtrl', 
    ['$scope', '$cookies', '$http', 'forms',
    function($scope, $cookies, $http, forms) {

    $http.get(forms.getFormUrl()).
      success(function(data, status, headers, config) {
        $scope.hutForm = data;
      });

  }]);

})();
