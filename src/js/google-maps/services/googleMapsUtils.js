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
     * @param {google.maps.LatLngBounds} b1
     * @param {google.maps.LatLngBounds} b2
     * @return {boolean} true if b1 and b2 are 'very close'. If either are null
     * or not google.maps.LatLngBounds objects returns false.
     */
    function boundsEqual(b1, b2) {
      if (!(b1 instanceof google.maps.LatLngBounds &&
            b2 instanceof google.maps.LatLngBounds)) {
        return false;
      }
      var sw1 = b1.getSouthWest();
      var sw2 = b2.getSouthWest();
      var ne1 = b1.getNorthEast();
      var ne2 = b2.getNorthEast();

      return latLngEqual(sw1, sw2) && latLngEqual(ne1 && ne2);
    }

    /**
     * @param {google.maps.LatLng} latLng
     * @return {Object} object literal with 'lat' and 'lng' properties.
     * @throw if latLng not instanceof google.maps.LatLng
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
     * @param {Object} obj of the form { lat: 40, lng: -120 } 
     * @return {google.maps.LatLng} returns null if problems with obj (null,
     * NaN, etc.)
     */
    function objToLatLng(obj) {
      if (obj != null) {
        var lat = obj.lat;
        var lng = obj.lng;
        var ok = !(lat == null || lng == null) && !(isNaN(lat) ||
            isNaN(lng));
        if (ok) {
          return new google.maps.LatLng(lat, lng);
        }
      }  
      return null;
    }

    /**
     * @param {google.maps.LatLngBounds} bounds
     * @return {Object} object literal of the form { 
     *    southWest: {lat: 40, lng: -120}, 
     *    northEast: {lat: 40, lng: -120}
     *  }
     * @throw if bounds not instanceof google.maps.LatLngBounds
     */
    function boundsToObj(bounds) {
      if (!(bounds instanceof google.maps.LatLngBounds)) {
        throw 'bounds not a google.maps.LatLngBounds';
      }
      var sw = bounds.getSouthWest();
      var ne = bounds.getNorthEast();
      return {
        southWest: {
          lat: sw.lat(),
          lng: sw.lng()
        },
        northEast: {
          lat: ne.lat(),
          lng: ne.lng()
        }
      };
    }

    /**
     * @param {Object} obj literal of the form { 
     *    southWest: {lat: 40, lng: -120}, 
     *    northEast: {lat: 40, lng: -120}
     *  }
     * @return {google.maps.LatLngBounds} returns null if problems with obj
     * (null, NaN, etc.)
     */
    function objToBounds(obj) {
      if (obj != null && obj.southWest && obj.northEast) {
        var values = [obj.southWest.lat, obj.southWest.lng,
          obj.northEast.lat, obj.northEast.lng];
        var ok = true;
        angular.forEach(values, function(value, i) {
          if (value == null || isNaN(value))
            ok = false;
        });
        if (ok) {
          return new google.maps.LatLngBounds(
            new google.maps.LatLng(values[0], values[1]),
            new google.maps.LatLng(values[2], values[3]));
        }
      }
      return null;
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
      boundsEqual: boundsEqual,
      latLngToObj: latLngToObj,
      objToLatLng: objToLatLng,
      boundsToObj: boundsToObj,
      objToBounds: objToBounds,
      isLatLngNullOrNaN: isLatLngNullOrNaN
    }
  }]);
})();
