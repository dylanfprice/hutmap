'use strict';

(function () {
  var app = angular.module('hutmap.filters', []);

  app.filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]);

})();
