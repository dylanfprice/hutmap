'use strict';

(function () {
  angular.module('hutmapServices', []).

  factory('Huts', ['$resource', function($resource){
    return $resource('/huts/api/v1/hut', {}, {
      query: {method:'GET', params:{limit: 0}
    }});
  }]);
})();
