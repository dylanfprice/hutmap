(function () {
'use strict';

    angular.module('hutmap.directives').

    directive('hmForm', [function() {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                'model': '=',
                'schema': '=',
                'errors': '=',
            },
            controller: ['$scope', function($scope) {
                return {
                    scope: $scope
                };
            }],
        };
    }]). 

    service('createHmField', [function() {
        var fieldNameOf = function(modelAccessor) {
            return modelAccessor.slice(modelAccessor.lastIndexOf('.') + 1);
        };

        var hmFieldLinkFn = function(scope, inputElement, attrs, controllers) {
            var hmFormCtrl = controllers[0];
            var ngModelCtrl = controllers[1];
            var fieldName = fieldNameOf(attrs.ngModel);

            scope.tagName = attrs.ngModel; 

            ngModelCtrl.$render = function() {
                inputElement.val(ngModelCtrl.$viewValue);
            }

            inputElement.on('input change', function() {
                scope.$apply(function() {
                    ngModelCtrl.$setViewValue(inputElement.val());
                });
            });

            ngModelCtrl.$viewChangeListeners.push(function() {
                hmFormCtrl.scope.model[fieldName] = ngModelCtrl.$modelValue;
            });

            hmFormCtrl.scope.$watch('model.' + fieldName, function(value) {
                if (value) {
                    scope.model[fieldName] = value;    
                }
            });

            hmFormCtrl.scope.$watch('errors', function(errors) {
                if (errors) {
                    scope.fieldErrors = errors[fieldName];
                }
            });

            hmFormCtrl.scope.$watch('schema', function(schema) {
                if (schema) {
                    var fieldSchema = schema.fields[fieldName]
                    var fieldAttrs = [
                        'choices', 
                        'blank', 
                        'help_text', 
                        'verbose_name'
                    ]
                    angular.forEach(fieldAttrs, function(attr) {
                        scope[attr] = fieldSchema[attr];
                    });
                }
            });
        }

        return function(inputTag, templateUrl, extraLinkFn) {
            return {
                restrict: 'E',
                replace: false,
                require: ['^hmForm', 'ngModel'],
                scope: true,
                templateUrl: templateUrl,
                link: function(scope, element, attrs, controllers) {
                    hmFieldLinkFn(
                        scope,
                        element.find(inputTag),
                        attrs,
                        controllers
                    );
                    extraLinkFn(scope, element, attrs, controllers);
                }
            };
        }
    }]).

    directive('hmTextField', 
        ['createHmField',
        function (createHmField) {
            var extraLinkFn = function(scope, element, attrs) {
                scope.inputType = 'text';
                if (attrs.help !== undefined) {
                    scope.help = attrs.help;
                }
            }
            return createHmField('input', 'hm-fields/input.html', extraLinkFn);
    }]).
    
    directive('hmTextareaField', 
        ['createHmField',
        function (createHmField) {
            var extraLinkFn = function(scope, element, attrs) {
                if (attrs.help !== undefined) {
                    scope.help = attrs.help;
                }
            }
            return createHmField('input', 'hm-fields/textarea.html', extraLinkFn);
    }]).

    directive('hmSelectField', 
        ['createHmField',
        function(createHmField) {
            var extraLinkFn = function(scope, element, attrs) {
                if (attrs.multiple !== undefined) {
                    element.find('select').attr('multiple', 'multiple');
                }
                if (attrs.help !== undefined) {
                    scope.help = attrs.help;
                }
            }
            return createHmField('select', 'hm-fields/select.html', extraLinkFn);
    }]);

})();
