'use strict';

(function () {
  angular.module('hutmap.directives', []).

  directive('hmMap',
    ['$parse', 'hutmapConfig', 'googleMaps', function ($parse, hutmapConfig, googleMaps) {

      //Setup map events from a google map object to trigger on a given element too,
      //then we just use ui-event to catch events from an element
      function bindMapEvents(scope, eventsStr, googleObject, element) {
        angular.forEach(eventsStr.split(' '), function (eventName) {
          //Prefix all googlemap events with 'map-', so eg 'click' 
          //for the googlemap doesn't interfere with a normal 'click' event
          var $event = { type: 'map-' + eventName };
          google.maps.event.addListener(googleObject, eventName, function (evt) {
            element.triggerHandler(angular.extend({}, $event, evt));
            //We create an $apply if it isn't happening. we need better support for this
            //We don't want to use timeout because tons of these events fire at once,
            //and we only need one $apply
            if (!scope.$$phase) scope.$apply();
          });
        });
      }

      var counter = 0;
      function getCount() {
        return counter++;
      }

      function getMapId(elm) {
        var id = elm.attr('id') || elm.data('id');
        if (!id) {
          id = getCount();
          elm.data('id', count);
        }
        return id;
      }

      var mapEvents = 'bounds_changed center_changed click dblclick drag dragend ' +
        'dragstart heading_changed idle maptypeid_changed mousemove mouseout ' +
        'mouseover projection_changed resize rightclick tilesloaded tilt_changed ' +
        'zoom_changed';

      var mapOptions = hutmapConfig.map || {};

      return {
        restrict: 'A',
        //doesn't work as E for unknown reason
        link: function (scope, elm, attrs) {
          var id = getMapId(elm);
          var map = googleMaps.getMap(id);
          if (!map) {
            map = googleMaps.addMap(id, elm[0], mapOptions);
          }

          var model = $parse(attrs.hmMap);

          //Set scope variable for the map
          model.assign(scope, map);

          bindMapEvents(scope, mapEvents, map, elm);
        }
      };
    }]);

})();
