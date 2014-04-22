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
    return function(objects, key, delimiter) {
      delimiter = (typeof delimiter === "undefined") ? ', ' : delimiter;        
      var array = [];
      angular.forEach(objects, function(object) {
        if (object[key] != 0) {
          array.push(object[key]);
        }
      });
      return array.join(delimiter);
    }
  }).
  
  filter('urlDomain', function() {
    return function(url) {
      if (url != null) {
        var matches = url.toLowerCase().match(
          /^(?:https?\:\/\/)?(?:www\.)?([^\/?#]+)(?:[\/?#]|$)/i
        )
        if (matches != null) {
          return matches[1];
        }
      }
    }
  });

})();
