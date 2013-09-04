'use strict';

(function () {
  angular.module('hutmap.services').

  // access the gapi link shortener
  provider('gapi', function() {
    var gapiProvider = {}

    var apiKey = null;

    gapiProvider.apiKey = function(_apiKey) {
      apiKey = _apiKey;
    };

    gapiProvider.$get = ['$rootScope', '$q', function($rootScope, $q) {

      var gapiDeferred = $q.defer();
      var gapiLoaded = gapiDeferred.promise;

      gapi.client.setApiKey(apiKey);

      gapi.client.load('urlshortener', 'v1', function() {
        $rootScope.$apply(function() {
          gapiDeferred.resolve()
        });
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
