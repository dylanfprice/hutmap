(function () {
'use strict';

  angular.module('hutmap.services').

  // access the gapi link shortener
  provider('gapi', function() {
    var gapiProvider = {}

    var apiKey = null;

    gapiProvider.apiKey = function(_apiKey) {
      apiKey = _apiKey;
    };

    gapiProvider.$get = ['$rootScope', '$q', '$window', function($rootScope, $q, $window) {

      var gapiDeferred = $q.defer();
      var gapiLoaded = gapiDeferred.promise;

      $rootScope.$watch(
        function() {
            return $window.gapi != null && $window.gapi.client != null;
        },
        function(v) { 
          if (v) {
            gapi.client.setApiKey(apiKey);

            gapi.client.load('urlshortener', 'v1', function() {
              $rootScope.$apply(function() {
                gapiDeferred.resolve()
              });
            });
          }
      });

      var gapiFns = {};

      gapiFns.shorten = function(url) {
        var shortUrlDeferred = $q.defer();
        gapiLoaded.then(function() {
          var request = gapi.client.urlshortener.url.insert({
            resource: {
              longUrl: url
            }
          });
          request.execute(function(response) {
            $rootScope.$apply(function() {
              shortUrlDeferred.resolve(response.id);
            });
          });
        });
        return shortUrlDeferred.promise;
      };

      return gapiFns;
    }];

    return gapiProvider;
  });

})();
