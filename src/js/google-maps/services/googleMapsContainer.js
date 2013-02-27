'use strict';

(function () {
  angular.module('google-maps').

  factory('googleMapsContainer', ['$q', function($q) {
    var maps = {};
    var defers = {};

    function addMap(mapId, mapDiv, mapOptions) {
      if (mapId in maps) {
        return getMap(mapId);
      }
      var map = new google.maps.Map(mapDiv, mapOptions);
      maps[mapId] = map;
      if (mapId in defers) {
        defers[mapId].resolve(map);
      }
      return map;
    }

    function getMap(mapId) {
      return maps[mapId];
    }

    function getMapPromise(mapId) {
      var defer = defers[mapId] || $q.defer();  
      defers[mapId] = defer;
      return defer.promise;
    }

    /**
     * Removes map with given mapId from this container. Really only for
     * testing since the google.maps.Map object still exists and is still bound
     * to the DOM.
     */
    function removeMap(mapId) {
      if (mapId in maps) {
        delete maps[mapId];
      }
      if (mapId in defers) {
        delete defers[mapId];
      }
    }

    return {
      addMap: addMap,
      getMap: getMap,
      getMapPromise: getMapPromise,
      removeMap: removeMap
    }
  }]);
})();
