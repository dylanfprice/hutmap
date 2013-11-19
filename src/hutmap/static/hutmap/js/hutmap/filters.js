(function () {
'use strict';

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
    }
  }).

  filter('listifyObjects', function() {
    return function(objects, key) {
      console.log(objects, key);
      var array = [];
      angular.forEach(objects, function(object) {
        array.push(object[key]);
      });
      console.log(array);
      return array.join(', ');
    }
  });

})();
