'use strict';

(function () {
  angular.module('hutmap.directives', [])

  .directive('blur', ['$parse', function ($parse) {
    return function (scope, elem, attrs) {
      var blurFn = $parse(attrs.blur);
      elem.bind('blur', function () {
        blurFn(scope);
      });
    };
  }]).

  directive('dynamic', ['$compile', function ($compile) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, ele, attrs) {
        scope.$watch(attrs.dynamic, function(html) {
          ele.html(html);
          $compile(ele.contents())(scope.$parent);
        });
      }
    };
  }]);

})();
