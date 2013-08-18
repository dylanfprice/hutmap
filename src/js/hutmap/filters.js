'use strict';

(function () {
  angular.module('hutmap.filters', []).

  filter('orderFilter', function() {
    return function(obj) {
      var array = [];
      Object.keys(obj).forEach(function(key) {
        var val = obj[key];
        val.$name = key;
        array.push(obj[key]);
      });
      array.sort(function(a, b) {
        return a.$position - b.$position;
      });
      return array;
  }});

})();
