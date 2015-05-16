(function() {
'use strict';
    angular.module('ui_components').

    directive('buttonGroup', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            scope: {
                'labels': '=' 
            },
            link: function (scope, ele, attrs) {
                console.log('here', scope.labels);
                angular.forEach(scope.labels, function(value, index) {
                    ele.append('<div>' + value + '</div>');
                })
            }
        };
    }]);
})();
