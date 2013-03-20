'use strict';

(function () {
  angular.module('hutmap').

  controller('HutmapCtrl', ['$scope', '$route', '$location', '$timeout', 'googleMapsContainer', function($scope, $route, $location, $timeout, googleMapsContainer) {
    $scope.$route = $route;
    $scope.loading = false;

    $scope.setLoading = function(loading) {
      $scope.loading = loading;
    };

  }]).

  controller('CarouselCtrl', ['$scope', '$route', function($scope, $route) {
    $scope.carouselInterval = 6000;
    $scope.slides = [
      {title: 'Big Hut', text: 'lorem ipsum dolor', image: 'https://mail-attachment.googleusercontent.com/attachment/u/0/?ui=2&ik=8768b5ed5b&view=att&th=13ba670d57d0c5f1&attid=0.3&disp=inline&realattid=f_haswzj3n2&safe=1&zw&saduie=AG9B_P9lJiRTwBR09D1jE4IKml8C&sadet=1363715869360&sads=7jqjo-uAUQ2mWgLwJ-5zPIGflA0'},
      {title: 'Joe River Chickee', text: 'lorem ipsum dolor', image: 'https://mail-attachment.googleusercontent.com/attachment/u/0/?ui=2&ik=8768b5ed5b&view=att&th=13ba670d57d0c5f1&attid=0.5&disp=inline&realattid=f_haswzj3u4&safe=1&zw&saduie=AG9B_P9lJiRTwBR09D1jE4IKml8C&sadet=1363715863132&sads=kmhkET9W_d5-f6HLhAIZpt5kx2U'},
      {title: 'John Muir Shelter', text: 'lorem ipsum dolor', image: 'https://mail-attachment.googleusercontent.com/attachment/u/0/?ui=2&ik=8768b5ed5b&view=att&th=13ba670d57d0c5f1&attid=0.6&disp=inline&realattid=f_haswzj3v5&safe=1&zw&saduie=AG9B_P9lJiRTwBR09D1jE4IKml8C&sadet=1363715851827&sads=yGOzj2H_sDdau-G_UX0F2mW-MrE&sadssc=1'},
    ];
  }]).

  controller('HutInfoCtrl', ['$scope', function($scope) {
    $scope.accuracy_tooltip = [
      'Coordinates provided, but unverifiable.',
      'Wild ass guess.',
      'Slightly better than a wild ass guess.',
      'Found structure on satellite or topo map.',
      'Surveyed with GPS by the Hutmap team.',
      'Found on a map and surveyed by the Hutmap team.'  
    ];
  }]).

  controller('SearchCtrl', 
    ['$scope', '$location', '$route', '$log', 'Places', 
    function($scope, $location, $route, $log, Places) {

    $scope.submitting = false;
    $scope.lastQuery;
    $scope.selected;

    $scope.getPlaces = function(query) {
      $scope.lastQuery = query;
      if (query && !$scope.submitting) {
        return Places.getPlacePredictions(query);
      } else {
        return [];
      }
    };

    var logError = function(status) {
      $scope.submitting = false;
      $log.error(status);
    };

    var selectPlace = function(place) {
      $scope.submitting = false;
      $route.reload();
      // TODO: change this to events, or make a parent scope that MapCtrl can watch?
      $location.
        path('/map/').
        search('m_center', place.geometry.location.toUrlValue()).
        search('m_zoom', 8);
        if (place.geometry.viewport) {
          $location.search('h_bbox', place.geometry.viewport.toUrlValue());
        }
    };

    $scope.submit = function() {
      if ($scope.selected) {
        $scope.submitting = true;
        var selected = $scope.selected;
        if (selected.reference) {
          Places.getDetails(selected.reference).then(
            function(place) {
              selectPlace(place);
            },
            logError
          );
        }
      } else {
        var lastQuery = $scope.lastQuery;
        if (lastQuery) {
          $scope.submitting = true;
          Places.getPlacePredictions(lastQuery).then(
            function(predictions) {
              Places.getDetails(predictions[0].reference).then(
                function(place) {
                  selectPlace(place);
                },
                logError
              );
            },
            logError
          );
        }
      }
    };
  }]);
})();
