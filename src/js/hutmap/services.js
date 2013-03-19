'use strict';

(function () {
  angular.module('hutmapServices', []).

  factory('Huts', ['$resource', function($resource){
    return $resource('/huts/api/v1/hut', {}, {
      query: {method:'GET', params:{}
    }});
  }]).

  factory('utils', [function() {
    function latLngFromUrlValue(urlValue) {
      var array = urlValue.split(',');
      return new google.maps.LatLng(array[0], array[1]);
    }

    return {
      latLngFromUrlValue: latLngFromUrlValue
    }
  }]);

})();
