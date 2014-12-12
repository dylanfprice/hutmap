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

        var cleanHut = function(hut) {
            var cleanHut = angular.copy(hut);
            if (hut.location != null) {
                var coords = hut.location.split(',');
                cleanHut.location = {'type': 'Point', 'coordinates': [parseInt(coords[1]), parseInt(coords[0])]}
            }
            return cleanHut;
        }

        $scope.submit = function(hut) {
            $scope.form.errors = {};
            hut = cleanHut(hut);
            $http.post('/api/v1/hutsuggestion/', hut).
                success(function(data, status, headers, config) {
                    console.log('success', data, status);
                    $scope.addAlert('success', 'Submitted hut suggestion for ' + hut.name);
                }).
                error(function(data, status, headers, config) {
                    console.log('error', data, status);
                    $scope.form.errors = data.hutsuggestion;
                    $scope.addAlert('error', 'Please correct the errors below');
                });
        }
      
    }]);

})();
