(function(ng) {
'use strict';
    ng.module('ui_components').

    directive('buttonGroup', [function () {
        return {
            restrict: 'E',
            scope: {
                'items': '=',
                'labelAttr': '@',
                'selectedAttr': '@',
                'any': '&',
            },
            templateUrl: '/static/ui_components/html/components/button_group.html',
            link: function (scope, ele, attrs) {
                scope.anyIncluded = scope.any();
                scope.anySelected = true;

                scope.setSelected = function(item, selected) {
                    if (selected) {
                        scope.anySelected = false;
                    }
                    
                    item[scope.selectedAttr] = selected;
                }

                scope.isSelected = function(item) {
                    return item[scope.selectedAttr];
                }

                scope.toggle = function(item) {
                    scope.setSelected(item, !scope.isSelected(item));
                }

                scope.getLabel = function(item) {
                    return item[scope.labelAttr];
                }

                scope.setAnySelected = function(selected) {
                    angular.forEach(scope.items, function(item, index) {
                        scope.setSelected(item, !selected);
                    });

                    scope.anySelected = selected;
                }

                scope.isAnySelected = function() {
                    return scope.anySelected;
                }

                scope.toggleAny = function() {
                    scope.setAnySelected(!scope.isAnySelected());
                }

                if (scope.anyIncluded) {
                    angular.forEach(scope.items, function(item, index) {
                        scope.setSelected(item, true);
                    });
                }
            }
        };
    }]);
})(angular);
