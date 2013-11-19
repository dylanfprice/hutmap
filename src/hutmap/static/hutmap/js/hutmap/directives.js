(function () {
'use strict';

  angular.module('hutmap.directives', []).

  directive('hutForm', ['$compile', function ($compile) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, ele, attrs) {
        scope.$watch(attrs.hutForm, function(html) {
          ele.html(html);
          $compile(ele.contents())(scope.$parent);
          ele.closest('.modal-wrapper').scrollTop(0);
        });

        scope.$watch('hut', function(newVal) {
          if (newVal) {
            ele.find('select:not(select[multiple])').each(function(index, select) {
              var name = $(select).attr('name');
              var selectedOption = $(select).children('option[selected]').first();
              var value = $(selectedOption).attr('value');
              scope.hut[name] = value;
            });
          }
        });
      }
    };
  }]);

})();
