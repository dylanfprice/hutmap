(function (ng) {
    'use strict';

    ng.module('ui_components').

    controller('ButtonGroupDemo', ['$scope', '$log', function($scope, $log) {
        $scope.buttons = ['a', 'b', 'c'];        
    }]);

})(angular);

