(function(ng) {
'use strict';
    ng.module('ui_components').

    directive('buttonGroup', [function () {
        return {
            restrict: 'E',
            scope: {
                'labels': '=' 
            },
            link: function (scope, ele, attrs) {
                angular.forEach(scope.labels, function(value, index) {
                    ele.append('<div>' + value + '</div>');
                })
            }
        };
    }]);
})(angular);
