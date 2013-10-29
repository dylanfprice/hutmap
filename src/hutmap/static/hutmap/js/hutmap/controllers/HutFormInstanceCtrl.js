(function () {
'use strict';

  angular.module('hutmap.controllers').

  controller('HutFormInstanceCtrl', 
    ['$scope', '$http', '$modalInstance', '$cookies', 'hutFormUrl', 'header', '$log',
    function($scope, $http, $modalInstance, $cookies, hutFormUrl, header, $log) {
    
    $scope.hut = null;
    $scope.header = header;
    $scope.submitting = false;

    $scope.select2Options = {
      width: 'resolve',
      placeholderOption: 'first',
    };

    $http.get(hutFormUrl).
      success(function(data, status, headers, config) {
        $scope.hutForm = data;
      });
    
    var submitHut = function(url, hut) {
      angular.forEach(hut, function(val, key) {
        if (val === null) {
          hut[key] = '';
        }
      });

      $scope.submitting = true;
      $http.uploadFile({
        url: url, 
        headers: {'X-CSRFToken': $cookies.csrftoken},
        data: hut,
        file: hut.photo
      }).progress(function(evt) {
        $log.info('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        $scope.$apply(function() {
          if (status === 201) {
            $modalInstance.close(hut);
          } else {
            $scope.hutForm = data;
          }
          $scope.submitting = false;
        });
      }).error(function(data, status, headers, config){
        $log.error('ERROR: ', status, data);
        $scope.$apply(function() {
          $modalInstance.dismiss('error');
          $scope.submitting = false;
        });
      });
    };

    $scope.submit = function() {
      if ($scope.hut != null) {
        submitHut(hutFormUrl, $scope.hut);
      } else {
        $log.warn('$scope.hut was null', $scope.hut);
      }
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

  }]);

})();
