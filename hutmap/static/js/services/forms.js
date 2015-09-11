(function () {
'use strict';

  angular.module('hutmap.services').

  factory('forms', ['$location', function($location) {
    var forms = {};

    forms.getFormUrl = function() {
        return '/forms' + $location.path();
    }

    return forms;
  }]);

})();
