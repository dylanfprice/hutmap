(function () {
'use strict';

  angular.module('hutmap.controllers').

  /*
   * This controller does configuration of the google map, as well as provides
   * functions which aren't really 'clean' enough to be in MapCtrl, i.e.
   * involve dom manipulation or calling into google.maps.
   */
  controller('MapConfigCtrl', 
    
    ['$scope', '$http', 'hutmapMapId', 'mapOptions',
    'markerOptions',

    function ($scope, $http, hutmapMapId, mapOptions,
      markerOptions) {

    var prevSelectedMarker;
    var prevIcon;

    $scope.mc = {
      hutmapMapId: hutmapMapId,
      mapOptions: mapOptions.main
    };

    // return proper google.maps.MapOptions for the given hut
    $scope.getMarkerOptions = function(hut) {
      var opts = {};

      if ($scope.h.filteredHuts && hut.id in $scope.h.filteredHutIds) {
        opts = angular.extend(opts, markerOptions.filteredHuts);
      } else {
        opts = angular.extend(opts, markerOptions.huts);
      }

      if ($scope.h.selectedHut && $scope.h.selectedHut.id === hut.id) {
        opts = angular.extend(opts, markerOptions.selected);
      }

      return opts;
    };

    $scope.unselectHut = function() {
      if (prevSelectedMarker) {
        var opts = angular.extend({}, markerOptions.huts, {icon: prevIcon});
        prevSelectedMarker.setOptions(opts);
      }
      $scope.h.selectedHut = null;
    }

    // called when marker is clicked or hut is otherwise selected
    $scope.selectHut = function(marker, hut) {
      $scope.unselectHut();
      prevSelectedMarker = marker;
      prevIcon = marker.getIcon();
      marker.setOptions(markerOptions.selected);
      $scope.h.selectedHut = hut;
    };
  }]);
})();
