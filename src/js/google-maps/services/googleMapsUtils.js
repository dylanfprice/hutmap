'use strict';

(function () {
  angular.module('google-maps').

  factory('googleMapsUtils', [function() {

    var counter = 0;
    function getCount() {
      return counter++;
    }

    /**
     * @param {Object} a jQuery/angular element
     * @return a unique id for the given element (as long as you don't use
     * integers for html id attributes)
     */
    function getMapId(elm) {
      var id = elm.attr('id') || elm.data('id');
      if (!id) {
        id = getCount();
        elm.data('id', id);
      }
      return id;
    }
   
    /**
     * Check if two floating point numbers are equal. 
     * @return true if f1 and f2 are 'very close'
     */
    function floatEqual (f1, f2) {
      return (Math.abs(f1 - f2) < 0.000001);
    }

    /**
     * @param {google.maps.LatLng} l1
     * @param {google.maps.LatLng} l2
     * @return {boolean} true if l1 and l2 are 'very close'. If either are null
     * or not google.maps.LatLng objects returns false.
     */
    function latLngEqual(l1, l2) {
      if (!(l1 instanceof google.maps.LatLng && 
            l2 instanceof google.maps.LatLng)) {
        return false; 
      }
      return floatEqual(l1.lat(), l2.lat()) && floatEqual(l1.lng(), l2.lng());
    }

    /**
     * @param {google.maps.LatLng} latLng
     * @return {Object} object literal with 'lat' and 'lng' properties
     */
    function latLngToObj(latLng) {
      if (!(latLng instanceof google.maps.LatLng)) 
        throw 'latLng not a google.maps.LatLng';

      return {
        lat: latLng.lat(),
        lng: latLng.lng()
      };
    }

    /**
     * @param {google.maps.LatLng} latLng
     * @return true if either lat or lng of latLng is null or isNaN
     */
    function isLatLngNullOrNaN(latLng) {
      if (latLng == null) {
        return false;
      } 
      var isNull = (latLng.lat() == null || latLng.lng() == null);
      var isNotaN =  isNaN(latLng.lat()) || isNaN(latLng.lng());
      return isNull || isNotaN;
    }

    return {
      getMapId: getMapId,
      latLngEqual: latLngEqual,
      latLngToObj: latLngToObj,
      isLatLngNullOrNaN: isLatLngNullOrNaN
    }
  }]);
})();
