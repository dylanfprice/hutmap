(function () {
'use strict';

  angular.module('hutmap.controllers').

  controller('LinkCtrl', 
    ['$scope', '$location', '$rootScope', '$timeout', 'gapi',
    function($scope, $location, $rootScope, $timeout, gapi) {

      $scope.link = {
        open: false,
      };

      $scope.generateLink = function() {
        $scope.link.value = '...';
        $scope.link.open = !$scope.link.open;

        if ($scope.link.open) {
          $scope.$broadcast('writeLocation');
          var url = $location.absUrl();
          gapi.shorten(url).then(function(url) {
            $scope.link.value = url;
            $timeout(function() {
              addthis.toolbox('.addthis_toolbox');
            });
          });
          $location.search({});
        }
      };
     
  }]);
})();
