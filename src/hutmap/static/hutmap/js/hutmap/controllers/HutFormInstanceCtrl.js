(function () {
'use strict';

  angular.module('hutmap.controllers').

  controller('HutFormInstanceCtrl', 
    ['$scope', '$http', '$upload', '$cookies', '$log', '$route',
     'markerOptions', 'mapOptions', 'forms', 
    function($scope, $http, $upload, $cookies, $log, $route,
             markerOptions, mapOptions, forms) {

    $scope.hut = null;
    $scope.huts = [null];
    $scope.submitting = false;

    $scope.setLocation = function(location) {
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

    var submitHut = function(url, hut) {
      $scope.submitting = true;
      $upload.upload({
        url: url, 
        headers: {'X-CSRFToken': $cookies.csrftoken},
        data: hut,
        file: hut.photo || null,
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
          $scope.addAlert('success', "Successfully submitted suggestion for " + hut.name + "!");
          $route.reload();
        } else {
          $scope.hutForm.form = data;
        }
        $scope.submitting = false;
      }).error(function(data, status, headers, config){
        $log.error('ERROR: ', status, data);
        $scope.submitting = false;
      });
    };

    $scope.submit = function() {
      if ($scope.hut != null) {
        submitHut(forms.getFormUrl(), $scope.hut);
      } else {
        $log.warn('$scope.hut was null', $scope.hut);
      }
    };

  }]);

})();
