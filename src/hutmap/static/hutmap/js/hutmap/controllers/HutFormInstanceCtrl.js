(function () {
'use strict';

  angular.module('hutmap.controllers').

  controller('HutFormInstanceCtrl', 
    ['$scope', '$http', '$upload', '$modalInstance', '$cookies', 'hutFormUrl', 'header', '$log',
    function($scope, $http, $upload, $modalInstance, $cookies, hutFormUrl, header, $log) {
    
    $scope.hut = null;
    $scope.header = header;
    $scope.submitting = false;

    $scope.select2Options = {
      width: 'resolve',
    };

    $http.get(hutFormUrl).
      success(function(data, status, headers, config) {
        $scope.hutForm = data;
      });
    
    var submitHut = function(url, hut) {
      $scope.submitting = true;
      $upload.upload({
        url: url, 
        headers: {'X-CSRFToken': $cookies.csrftoken},
        data: hut,
        file: hut.photo || '',
        formDataAppender: function(fd, key, val) {
          if (val === null) {
            fd.append(key, '');
          } else if (angular.isArray(val)) {
            angular.forEach(val, function(v) {
              fd.append(key, v);
            });
          } else {
            fd.append(key, val);
          }
        },
      }).progress(function(evt) {
        $log.info('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        if (status === 201) {
          $modalInstance.close(hut);
        } else {
          $scope.hutForm = data;
        }
        $scope.submitting = false;
      }).error(function(data, status, headers, config){
        $log.error('ERROR: ', status, data);
        $modalInstance.dismiss('error');
        $scope.submitting = false;
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

    /*
    // TODO: #31 get rid of dirty hack for select fields
    $scope.$watch('hut', function(newVal) {
      if (newVal) {
        $('select:not(select[multiple])').each(function(index, select) {
          var name = $(select).attr('name');
          var selectedOption = $(select).children('option[selected]').first();
          var value = $(selectedOption).attr('value');
          $scope.hut[name] = value;
        });
      }
    });
    */

  }]);

})();
