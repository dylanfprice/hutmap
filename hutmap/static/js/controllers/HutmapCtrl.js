(function () {
'use strict';

  angular.module('hutmap.controllers').

  controller('HutmapCtrl', 
    ['$scope', '$state', '$location', '$q', 'Huts', 'MaxZoom', 'utils', 
    function($scope, $state, $location, $q, Huts, MaxZoom, utils) {
    
    $scope.map = {
      center: null,            // google.maps.LatLng
      bounds: null,            // google.maps.LatLngBounds
      zoom: null,              // integer
      mapTypeId: null,         // google.maps.MapTypeId
      hutMarkerEvents: null,   // see http://dylanfprice.github.io/angular-gm/docs/module-gmMarkers.html
      initialized: $q.defer(), // for proper ordering of events
    };
    
    $scope.h = {
      loading: 0,            // truthy if huts are being queried/loaded
      huts: null,            // array of hut objects in current viewport
      filteredHuts: null,    // array of hut objects corresp. to those matching the filters
      filteredHutIds: null,  // sparse array of hut ids, each id is in filteredHutIds[id]
      query: null,           // current query for the Huts service
      selectedHut: null, 
      selectedHutImgUrl: null,
      selectedHutObliques: [],
      selectedHutRegion: null,
      selectedHutAgency: null,
      initialized: $q.defer()
    };
    
    // WARNING: Only working robustly for loading from permalink, not for internal routing.
    $scope.$on("$stateChangeSuccess", function updateMapFromParams() {
      // Map parameters
      var center = $state.params.m_center ? utils.latLngFromUrlValue($state.params.m_center) : undefined;
      var bounds = $state.params.m_bounds ? utils.boundsFromUrlValue($state.params.m_bounds) : undefined;
      var zoom = $state.params.m_zoom ? Number($state.params.m_zoom) : undefined;
      var mapTypeId = $state.params.m_maptypeid;
      $scope.setMap(center, zoom, bounds, mapTypeId);
      // Hut selection
      var id = $state.params.h_selected ? Number($state.params.h_selected) : undefined;
      $scope.setHut(id);
      // Clear params from url
      $location.search({});
    });
        
    $scope.setMap = function(center, zoom, bounds, mapTypeId) {
      $scope.map.initialized.promise.then(function() {
        if (mapTypeId) $scope.map.mapTypeId = mapTypeId;
        if (center) $scope.map.center = center;
        if (bounds) {
          $scope.map.bounds = bounds;
        } else {
          if (zoom) $scope.map.zoom = zoom;
        }
      });      
    };
    
    $scope.setHut = function(id) {
      if (id) {
        $scope.h.initialized.promise.then(function() {
          Huts.hut(id).then(function(hut) {
            $scope.h.selectedHut = hut;
            $scope.$broadcast('clickSelected');
          });
        });
      }
    };
    
    // HACK: Backup until routing works properly again. Very choppy map load.
    $scope.showOnMap = function(id) {
      if (id) {
        $state.go('map');
        $scope.h.initialized.promise.then(function() {
          Huts.hut(id).then(function(hut) {
            $scope.h.selectedHut = hut;
            $scope.setMap(utils.latLngFromHut(hut), 17, null, 'hybrid');
            $scope.$broadcast('clickSelected');
          });
        });
      }
    }
      
  }]);

})();
