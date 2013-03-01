describe('googleMapControllerFactory', function() {
  var mapCtrl, mapCntr;

  beforeEach(function() {
    module('google-maps');
  });


  beforeEach(inject(function($rootScope, googleMapControllerFactory, googleMapsContainer) {
    // set up scope
    var scope = $rootScope.$new();
    scope.mapOptions = function() {
      return {
        center: new google.maps.LatLng(2, 3),
        zoom: 1,
        mapTypeId: google.maps.MapTypeId.TERRAIN
      };
    };

    // set up attrs
    var attrs = {
      mapId: 'test'
    };

    // set up element
    var elm = angular.element('<div map-id="test" center="center" zoom="zoom" bounds="bounds" map-options="mapOptions">' +
                                '<div id="test"></div>' +
                              '</div');

    mapCtrl = new googleMapControllerFactory.MapController(scope, elm, attrs);
    mapCntr = googleMapsContainer;
  }));


  it('constructs the map using the provided map options', function() {
    expect(mapCtrl.dragging).toBeFalsy();
    expect(mapCtrl.center).toEqual(new google.maps.LatLng(2, 3));
    expect(mapCtrl.zoom).toEqual(1);
    var map = mapCntr.getMap('test');
    expect(mapCtrl.bounds).toEqual(map.getBounds());
  });


  it('constructs the map using defaults when there are no options', inject(function($rootScope, googleMapControllerFactory, googleMapsDefaults) {
    var scope = $rootScope.$new();
    scope.mapOptions = function() { };
    var attrs = {
      mapId: 'test2'
    };
    var elm = angular.element('<div map-id="test2" center="center" zoom="zoom" bounds="bounds">' +
                            '<div id="test2"></div>' +
                          '</div');
    mapCtrl = new googleMapControllerFactory.MapController(scope, elm, attrs);

    expect(mapCtrl.center).toEqual(googleMapsDefaults.mapOptions.center);
    expect(mapCtrl.zoom).toEqual(googleMapsDefaults.mapOptions.zoom);
  }));


  it('adds listeners to the map', function() {
    var called = false;
    mapCtrl.addMapListener('center_changed', function() {
      called = true;
    });
    google.maps.event.trigger(mapCntr.getMap('test'), 'center_changed');

    expect(called).toBeTruthy();
  });


  it('adds one time listeners to the map', function() {
    var callCount = 0;
    mapCtrl.addMapListenerOnce('center_changed', function() {
      callCount++;
    });
    google.maps.event.trigger(mapCntr.getMap('test'), 'center_changed');
    google.maps.event.trigger(mapCntr.getMap('test'), 'center_changed');

    expect(callCount).toEqual(1);
  });


  it('adds generic listeners', function() {
    var called = false;
    var object = {};
    mapCtrl.addListener(object, 'event', function() {
      called = true;
    });
    google.maps.event.trigger(object, 'event');

    expect(called).toBeTruthy();
  });


  it('adds generic one time listeners', function() {
    var callCount = 0;
    var object = {};
    mapCtrl.addListenerOnce(object, 'event', function() {
      callCount++;
    });
    google.maps.event.trigger(object, 'event');
    google.maps.event.trigger(object, 'event');

    expect(callCount).toEqual(1);
  });


  describe('marker functions', function() {
    var position, positionSame, positionVeryClose, position2;
    var markerOptions, markerOptionsSame, markerOptionsVeryClose, markerOptions2;

    beforeEach(function() {
      position = {lat:1,lng:2};
      positionSame ={lat:1.0004,lng:2.0004};
      positionVeryClose ={lat:1.0005,lng:2.0005};
      position2 = {lat:3,lng:4};

      markerOptions = {
        position: new google.maps.LatLng(1, 2)
      };
      markerOptionsVeryClose = {
        position: new google.maps.LatLng(1.0005, 2.0005)
      };
      markerOptionsSame = {
        position: new google.maps.LatLng(1.0004, 2.0004)
      };
      markerOptions2 = {
        position: new google.maps.LatLng(3, 4)
      };

      mapCtrl.addMarker(markerOptions);
    });

    describe('addMarker', function() {

      it('adds new markers to the map', function() {
        added = mapCtrl.addMarker(markerOptions2);
        expect(added).toBeTruthy();
      });

      
      it('does not add markers already on the map', function() {
        var added = mapCtrl.addMarker(markerOptions);
        expect(added).toBeFalsy();
      });


      it('adds markers which differ by at least 0.0005', function() {
        var added = mapCtrl.addMarker(markerOptionsVeryClose);
        expect(added).toBeTruthy();
      });


      it('does not add markers which differ less than 0.0005', function() {
        var added = mapCtrl.addMarker(markerOptionsSame);
        expect(added).toBeFalsy();
      });

    });


    describe('getMarker', function() {

      it('retrieves markers that are on the map', function() {
        var marker = mapCtrl.getMarker(position.lat, position.lng);
        expect(marker.getPosition()).toEqual(markerOptions.position);
      });


      it('returns null for marker not on the map', function() {
        var marker = mapCtrl.getMarker(position2.lat, position2.lng);
        expect(marker).toBeNull();
      });


      it('retrives markers given a lat and lng that are within 0.0005', function() {
        var marker = mapCtrl.getMarker(positionSame.lat, positionSame.lng);
        expect(marker.getPosition()).toEqual(markerOptions.position);
      });


      it('does not retrieve marker given lat and lng more than 0.0005 away', function() {
        var marker = mapCtrl.getMarker(positionVeryClose.lat, positionVeryClose.lng);
        expect(marker).toBeNull();
      });

    });


    describe('removeMarker', function() {

      it('removes markers from the map', function() {
        var removed = mapCtrl.removeMarker(position.lat, position.lng);
        expect(removed).toBeTruthy();
        expect(mapCtrl.getMarker(position.lat, position.lng)).toBeNull();
      });


      it('does not remove markers not on the map', function() {
        var removed = mapCtrl.removeMarker(position2.lat, position2.lng);
        expect(removed).toBeFalsy();
        expect(mapCtrl.getMarker(position.lat, position.lng)).not.toBeNull();
      });

    });


    it('fits the map to markers', function() {
      mapCtrl.addMarker(markerOptions2);
      mapCtrl.fitToMarkers();
      mapCtrl.addMapListener('bounds_changed', function() {
        expect(mapCtrl.bounds.contains(markerOptions.position)).toBeTruthy();
        expect(mapCtrl.bounds.contains(markerOptions.position)).toBeTruthy();
      });
    });


    it('can apply a function to each marker', function() {
      markers = [];
      mapCtrl.forEachMarker(function(marker) {
        markers.push(marker);
      });
      expect(markers.length).toEqual(1);
      expect(markers[0].getPosition()).toEqual(markerOptions.position);
    });

  });
});
