(function () {
'use strict';

  angular.module('hutmap.controllers').

  controller('HutFormCtrl', 
    ['$scope', '$http', 'mapOptions', 'markerOptions',
    function($scope, $http, mapOptions, markerOptions) {

    $scope.form = {}
    $scope.hut = {};

    $scope.form.schema = null;

    $scope.form.select2Options = {
      dropdownAutoWidth: true,
    };

    $http.get('/api/v1/hutsuggestion/schema/').
      success(function(data, status, headers, config) {
          $scope.form.schema = data;
      }).
      error(function(data, status, headers, config) {
      });
  
  }]);

})();
