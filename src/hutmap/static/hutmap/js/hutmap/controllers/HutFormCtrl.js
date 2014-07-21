(function () {
'use strict';

    angular.module('hutmap.controllers').

    controller('HutFormCtrl', 
        ['$scope', '$http', 'mapOptions', 'markerOptions',
        function($scope, $http, mapOptions, markerOptions) {

        $scope.form = {}
        $scope.hut = {};

        $scope.form.schema = null;
        $scope.form.errors = null;

        $http.get('/api/v1/hutsuggestion/schema/').
            success(function(data, status, headers, config) {
                  $scope.form.schema = data;
            }).
            error(function(data, status, headers, config) {
            });

        $scope.submit = function(hut) {
            $scope.form.errors = {};
            $http.post('/api/v1/hutsuggestion/', hut).
                success(function(data, status, headers, config) {
                    console.log('success', data, status);
                }).
                error(function(data, status, headers, config) {
                    console.log('error', data, status);
                    $scope.form.errors = data.hutsuggestion;
                });
        }
      
    }]);

})();
