'use strict';

(function() {
  angular.module('hutmap').

  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/partials/home.html',
        activetab: 'home',
      }).
      when('/map/', {
        templateUrl: '/partials/map.html',
        activetab: 'map',
        reloadOnSearch: false,
      }).
      when('/about/', {
        templateUrl: '/partials/about.html',
        activetab: 'about',
      });

    $locationProvider.html5Mode(true);
  }]).

  constant('hutmapMapId', 'map_canvas').

  value('mapOptions', {
    zoom : 8,
    center : new google.maps.LatLng(46.87916, -120),
    mapTypeId : google.maps.MapTypeId.TERRAIN,
    streetViewControl: false
  }).

  value('markerOptions', {
    huts: {
      icon: '/static/img/marker_gray_small.png',
      shape: {
        coord: [6, 0, 2, 2, 0, 6, 6, 13, 12, 6, 10, 2, 6, 0],
        type: 'poly'
      },
      zIndex: 0
    },
    filteredHuts: {
      icon: '/static/img/marker_red_small.png',
      shape: {
        coord: [6, 0, 2, 2, 0, 6, 6, 13, 12, 6, 10, 2, 6, 0],
        type: 'poly'
      },
      zIndex: 1
    },
    selected: {
      icon: '/static/img/marker_yellow_small.png',
      zIndex: 2
    }
  });

})();
