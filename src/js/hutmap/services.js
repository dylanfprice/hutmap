'use strict';

(function () {
  angular.module('hutmapServices', []).

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

        angular.forEach(data.huts.objects, function(hut, id) {
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

    Huts.hut = function(id) {
      return dbLoaded.promise.then(function() {
        return data.huts.objects[id];
      });
    };

    Huts.agency = function(id) {
      return dbLoaded.promise.then(function() {
        return data.agencies.objects[id];
      });
    };

    Huts.region = function(id) {
      return dbLoaded.promise.then(function() {
        return data.regions.objects[id];
      });
    };

    return Huts;
  }]).

  provider('Places', [function() {
    var PlacesProvider = {}

    var bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-90, 180),
      new google.maps.LatLng(90, -180)
    );

    PlacesProvider.bounds = function(latLngBounds) {
      bounds = latLngBounds;
    };

    PlacesProvider.$get = function() {
      var Places = {};

      var elt = angular.element('<div id="google-attributions"></div>');
      var placesService = new google.maps.places.PlacesService(elt[0]);
      var autocompleteService = new google.maps.places.AutocompleteService();

      function callback(success, error, result, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          success(result);
        } else {
          error(result);
        }
      }

      Places.getPlacePredictions = function(input, success, error) {
        autocompleteService.getPlacePredictions({input: input, bounds: bounds}, 
            angular.bind(this, callback, success, error));
      }

      Places.getDetails = function(reference, success, error) {
        placesService.getDetails({reference: reference}, 
          angular.bind(this, callback, success, error));
      };

      Places.textSearch = function(request, success, error) {
        placesService.textSearch(request, 
            angular.bind(this, callback, success, error));
      }

      return Places;
    };

    return PlacesProvider;
  }]).

  factory('utils', [function() {
    var utils = {};

    utils.latLngFromUrlValue = function(urlValue) {
      var array = urlValue.split(',');
      return new google.maps.LatLng(array[0], array[1]);
    }

    utils.latLngFromHut = function(hut) {
      return new google.maps.LatLng(hut.location.coordinates[1],
        hut.location.coordinates[0]);
    };
    
    utils.boundsFromUrlValue = function(urlValue) {
      var array = urlValue.split(',');
      return new google.maps.LatLngBounds(
        new google.maps.LatLng(array[0], array[1]),
        new google.maps.LatLng(array[2], array[3])
      );
    }

    return utils;
  }]);

})();
