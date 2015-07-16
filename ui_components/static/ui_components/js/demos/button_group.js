(function (ng) {
    'use strict';

    ng.module('ui_components').

    controller('ButtonGroupDemo', ['$scope', '$log', function($scope, $log) {
        $scope.buttons = [
            {'label': 'shared'},
            {'label': 'private'},
            {'label': 'unknown'},
        ];
    }]);

})(angular);

