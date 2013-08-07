'use strict';

(function () {
  angular.module('hutmap.controllers').

  controller('LinkCtrl', 
    ['$scope', '$location', '$q', '$rootScope',
    function($scope, $location, $q, $rootScope) {

      var gapiKey = $scope.GOOGLE_API_KEY
      var gapiDeferred = $q.defer();
      var gapiLoaded = gapiDeferred.promise;

      gapi.client.setApiKey(gapiKey)
      gapi.client.load('urlshortener', 'v1', function() {
        $rootScope.$apply(function() {
          gapiDeferred.resolve()
        });
      });
         
      var shorten = function(url) {
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

      var resetLink = function() {
        $scope.link = {
          value: '...'
        };
      }

      $scope.generateLink = function() {
        resetLink();
        $scope.$broadcast('updateLocation');
        var url = $location.absUrl();
        shorten(url).then(function(url) {
          $scope.link.value = url;
        });
        $location.search({});
      };

      resetLink();
  }]);
})();
