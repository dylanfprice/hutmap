'use strict';

(function() {
  angular.module('hutmap', ['hutmapServices', 'hutmapFilters', 'google-maps',
    'ngResource', '$strap.directives']).
 
  config(['$routeProvider', function($routeProvider) {

    /* Configure routes */
    //$routeProvider.when('/map', {templateUrl: '/angular/partials/map.html', controller: MapCtrl});
    //$routeProvider.when('/browse', {templateUrl: '/angular/partials/browse.html', controller: BrowseCtrl});
    //$routeProvider.otherwise({redirectTo: '/map'});
  }]);

})();
