'use strict';

(function () {
  angular.module('hutmap.services').

  factory('Huts', ['$http', '$q', 'utils', function($http, $q, utils) {
    var Huts = {};
    var data;
    var error;
    var dbLoaded = $q.defer();

    $http.get('/static/data/huts.json').success(function(resp) {
      if (resp != null) {
        data = resp;  
        dbLoaded.resolve();
      } else {
        dbLoaded.reject("/static/data/huts.json response was null");
      }
    }).error(function(error) {
      dbLoaded.reject(error);
    });;

    function hutInBounds(bounds, hut) {
      if (bounds) {
        var latLng = utils.latLngFromHut(hut);
        return bounds.contains(latLng);
      } else {
        return true;
      }
    }

    Huts.query = function(_params_) {
      return dbLoaded.promise.then(function() {
        var params = _params_ || {};
        var bounds = params.bounds;
        var limit = params.limit || 0;
        var huts = [];

        angular.forEach(data.huts.object_index, function(hut, id) {
          if ((limit === 0 || huts.length < limit) &&
              (hutInBounds(bounds, hut))) {

            huts.push(hut);
          }
        });

        return huts;
      });
    };

    Huts.totalHutCount = function() {
      return dbLoaded.promise.then(function() {
        return data.huts.meta.total_count;
      });
    };

    function getId(id) {
      if (id == null) {
        throw "id should not be null";
      }
      if (id.constructor === String && id.indexOf('/') > -1) {
        id = id.slice(0, -1);
        id = id.slice(id.lastIndexOf('/') + 1)
      } 
      return Number(id);
    }

    Huts.hut = function(id_or_resource_uri) {
      return dbLoaded.promise.then(function() {
        var id = getId(id_or_resource_uri);
        return data.huts.object_index[id];
      });
    };

    Huts.agency = function(id_or_resource_uri) {
      return dbLoaded.promise.then(function() {
        var id = getId(id_or_resource_uri);
        return data.agencies.object_index[id];
      });
    };

    Huts.region = function(id_or_resource_uri) {
      return dbLoaded.promise.then(function() {
        var id = getId(id_or_resource_uri);
        return data.regions.object_index[id];
      });
    };

    return Huts;
  }]);

})();
