(function () {
'use strict';

  angular.module('hutmap.controllers').

  controller('HutFormInstanceCtrl', 
    ['$scope', '$http', '$upload', '$modalInstance', '$cookies', 'hutFormUrl', 'header', '$log', 'markerOptions', 'mapOptions',
    function($scope, $http, $upload, $modalInstance, $cookies, hutFormUrl, header, $log, markerOptions, mapOptions) {
    
    $scope.hut = null;
    $scope.huts = [null];
    $scope.header = header;
    $scope.submitting = false;

    $scope.setLocation = function(location) {
      console.log('here');
      $scope.hut.location = location;
    }

    $scope.select2Options = {
      width: 'resolve',
    };

    $scope.markerOptions = markerOptions.filteredHuts;
    $scope.markerOptions['draggable'] = true;

    $scope.mapOptions = mapOptions.modal;

    $scope.positionFromHut = function(hut) {
      if (hut != null && hut.location != null) {
        var values = hut.location.split(',');
        if (values.length == 2) {
          var lat = parseFloat(values[0]);
          var lng = parseFloat(values[1]);
          if (!isNaN(lat) && !isNaN(lng)) {
            $scope.mapCenter = new google.maps.LatLng(lat, lng);
            return {lat: lat, lng: lng};
          }
        }
      }
      return null;
    }

    $scope.positionFromMarker = function(marker, hut) {
      $scope.hut.location = marker.getPosition().toUrlValue();
    }

    $scope.$watch('hut', function(newVal, oldVal) {
      if (oldVal === null && newVal != null) {
        $scope.huts = [$scope.hut];
      }
    });
 
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

  }]);

})();
