(function () {
'use strict';

  angular.module('hutmap.services').

  // get images for huts
  provider('HutImg', [function() {
    var HutImgProvider = {}
    var defaultSatellite = {
      width: 300,
      height: 250,
    };

    HutImgProvider.$get = ['$q', 'MaxZoom', 'utils', function($q, MaxZoom, utils) {
      var HutImg = {};

      function getObliqueImgUrl(hut) {
        var url = '';
        if (hut) {
          if (hut.photo) {
            url = hut.photo;
          }
          else if (hut.photo_url) {
            url = hut.photo_url;
          } 
        }
        return url;
      }

      function getSatelliteImgUrl(hut, width, height) {
        var urlDeferred = $q.defer();
        var latLng = utils.latLngFromHut(hut);
        var maxZoomPromise = MaxZoom.getMaxZoom(latLng);
        maxZoomPromise.then(function(maxZoom) {
          var url = 'http://maps.googleapis.com/maps/api/staticmap' + 
                    '?center=' + latLng.lat() + '%2C' + latLng.lng() +
                    '&zoom=' + Math.min(maxZoom, 19) +
                    '&size=' + width + 'x' + height +
                    '&maptype=satellite' +
                    '&sensor=false' +
                    '&key=' + hutmap.GOOGLE_API_KEY;
          urlDeferred.resolve(url);
        });
        return urlDeferred.promise;
      };

      HutImg.getHutImgUrl = function(hut) {
        var urlDeferred = $q.defer();
        if (hut && hut.show_satellite) {
          var urlPromise = getSatelliteImgUrl(hut, defaultSatellite.width, defaultSatellite.height);
          urlPromise.then(function(satelliteUrl) {
            urlDeferred.resolve(satelliteUrl);
          });
        } else {
          var obliqueUrl = getObliqueImgUrl(hut);
          if (obliqueUrl) {
            urlDeferred.resolve(obliqueUrl);
          } else {
            urlDeferred.resolve(hutmap.STATIC_URL + 'hutmap/img/no-image-available.gif');
          }
        }
        return urlDeferred.promise;
      }

      HutImg.getObliques = function(hut) {
        var obliquesDeferred = $q.defer();
        var obliques = [];
        var obliqueUrl = getObliqueImgUrl(hut);
        if (obliqueUrl) {
            obliques.push({
              src: obliqueUrl,
              name: hut.photo_credit_name,
              url: hut.photo_credit_url
            });
        }
        obliquesDeferred.resolve(obliques);
        return obliquesDeferred.promise;
      }

      return HutImg;
    }];

    return HutImgProvider;
  }]);

})();
