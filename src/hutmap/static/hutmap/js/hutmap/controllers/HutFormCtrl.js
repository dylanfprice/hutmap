(function () {
'use strict';

  angular.module('hutmap.controllers').

  controller('HutFormCtrl', 
    ['$scope', '$cookies', '$http', 'forms',
    function($scope, $cookies, $http, forms) {

    $scope.hutForm = {
        form: null,
    };

    $http.get(forms.getFormUrl()).
      success(function(data, status, headers, config) {
        $scope.hutForm.form = data;
      });

  }]);

})();
