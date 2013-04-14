'use strict';

(function () {
  angular.module('hutmap').

  controller('HutmapCtrl', 
    ['$scope', '$route', function($scope, $route) {

    $scope.$route = $route;
  }]).

  controller('CarouselCtrl', ['$scope', '$route', function($scope, $route) {
    $scope.carouselInterval = 6000;
    $scope.slides = [
      {title: 'Big Hut', text: 'lorem ipsum dolor', image: '/static/img/carousel/Big Hut.JPG'},
      {title: 'Joe River Chickee', text: 'lorem ipsum dolor', image: '/static/img/carousel/Joe River Chickee.JPG'},
      {title: 'John Muir Shelter', text: 'lorem ipsum dolor', image: '/static/img/carousel/John Muir Shelter.JPG'},
    ];
  }]).

  controller('AlertCtrl', ['$scope', function($scope) {
    // Of the form { type: 'error/warning/info', msg: 'message' }
    $scope.alerts = [
    ];

    $scope.addAlert = function(type, msg) {
      $scope.alerts.push({type:type,msg:msg});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
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
  }]);

})();
