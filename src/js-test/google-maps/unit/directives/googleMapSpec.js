describe('googleMap', function() {
  var elm, scope, mapCtrl; 
  var listeners, listenersOnce;
  var initCenter, initZoom, initBounds;
  var map;

  beforeEach(function() {
    module('google-maps');
    module('google-maps-test');
  });


  beforeEach(inject(function($rootScope, $compile, gmtestMapController, googleMapsContainer, googleMapsUtils) {
    // compile googleMap directive
    elm = angular.element('<google-map map-id="test" center="pCenter" zoom="pZoom" bounds="pBounds" map-options="mapOptions">' +
                            '<gmtest-get-map-controller></gmtest-get-map-controller>' +
                          '</google-map>');

    scope = $rootScope.$new();
    scope.mapOptions = {
      center: new google.maps.LatLng(1, 2),
      zoom: 3
    }
    $compile(elm)(scope);
    scope.$digest();

    map = googleMapsContainer.getMap('test');

    initCenter = { lat: 1, lng: 2 };
    initZoom = 3;
    initBounds = {
      southWest: {lat: 4, lng: 5},
      northEast: {lat: 6, lng: 7}
    };
    
    // get MapController
    mapCtrl = gmtestMapController();
    var center, zoom, bounds;
    Object.defineProperties(mapCtrl, {
      'center': {
        get: function() {return center;},
        set: function(newC) {center = newC;},
      },
      'zoom': {
        get: function() { return zoom;},
        set: function(newZ) {zoom = newZ;},
      },
      'bounds': {
        get: function() { return bounds;},
        set: function(newB) {bounds = newB;},
      },
    });

    var objToLatLng = googleMapsUtils.objToLatLng;
    var objToBounds = googleMapsUtils.objToBounds;
    mapCtrl.center = objToLatLng(initCenter);
    mapCtrl.zoom = initZoom;
    mapCtrl.bounds = objToBounds(initBounds);
  }));


  function testRequiredAttribute($rootScope, $compile, googleMapsContainer, elm) {
    scope = $rootScope.$new();
    $compile(elm)(scope);
    expect(scope.$digest).toThrow();
    googleMapsContainer.removeMap('test2');
  }


  it('requires the mapId attribute', inject(function($rootScope, $compile) {
    elm = angular.element('<google-map center="pCenter" zoom="pZoom" bounds="pBounds"></google-map>');
    scope = scope.$new();
    expect(angular.bind(this, $compile(elm), scope)).toThrow();
  }));


  it('requires the center attribute', inject(function($rootScope, $compile, googleMapsContainer) {
    elm = angular.element('<google-map map-id="test2" zoom="pZoom" bounds="pBounds"></google-map>');
    testRequiredAttribute($rootScope, $compile, googleMapsContainer, elm);
  }));


  it('requires the zoom attribute', inject(function($rootScope, $compile, googleMapsContainer) {
    elm = angular.element('<google-map map-id="test2" center="pCenter" bounds="pBounds"></google-map>');
    testRequiredAttribute($rootScope, $compile, googleMapsContainer, elm);
  }));


  it('requires the bounds attribute', inject(function($rootScope, $compile, googleMapsContainer) {
    elm = angular.element('<google-map map-id="test2" center="pCenter" zoom="pZoom"></google-map>');
    testRequiredAttribute($rootScope, $compile, googleMapsContainer, elm);
  }));


  it('updates scope on map initialization', inject(function($timeout) {
    google.maps.event.trigger(map, 'bounds_changed');

    $timeout.flush();
    
    expect(scope.pCenter).toEqual(initCenter);
    expect(scope.pZoom).toEqual(initZoom);
    expect(scope.pBounds).toEqual(initBounds);
  }));


  it('ignores initial scope values', inject(function($timeout) {
    scope.pCenter = { lat: 8, lng: 9 };
    scope.pZoom = 10;
    scope.pBounds = {
      southWest: {lat: 11, lng: 12},
      northEast: {lat: 13, lng: 14}
    };

    google.maps.event.trigger(map, 'bounds_changed');
    $timeout.flush();

    expect(scope.pCenter).not.toEqual(initCenter);
    expect(scope.pZoom).not.toEqual(initZoom);
    expect(scope.pBounds).not.toEqual(initBounds);
  }));


  // center and bounds changed, but zoom is same
  function testMapMovedEvent($timeout, event) {
    mapCtrl.center = new google.maps.LatLng(8, 9);
    mapCtrl.bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(10, 11),
      new google.maps.LatLng(12, 13));

    var center = { lat: 8, lng: 9 };
    var bounds = {
      southWest: {lat: 10, lng: 11},
      northEast: {lat: 12, lng: 13}
    };

    google.maps.event.trigger(map, event);
    $timeout.flush();

    expect(scope.pCenter).toEqual(center);
    expect(scope.pZoom).toEqual(initZoom);
    expect(scope.pBounds).toEqual(bounds);
  }


  it('updates scope on map drag', inject(function($timeout) {
    testMapMovedEvent($timeout, 'drag');
  }));


  it('updates scope on map center_changed', inject(function($timeout) {
    testMapMovedEvent($timeout, 'center_changed');
  }));


  it('updates scope on map zoom_changed', inject(function($timeout) {
    mapCtrl.zoom = initZoom + 2;
    var zoom = initZoom + 2;

    google.maps.event.trigger(map, 'zoom_changed');
    $timeout.flush();

    expect(scope.pZoom).toEqual(zoom);
  }));


  it('updates map on scope center changed', function() {
    scope.pCenter = {lat: 8, lng: 9};
    scope.$digest();
    expect(mapCtrl.center).toEqual(new google.maps.LatLng(8, 9));
  });

  
  it('updates map on scope zoom changed', function() {
    scope.pZoom = initZoom + 2;
    scope.$digest();
    expect(mapCtrl.zoom).toEqual(initZoom + 2);
  });

  
  it('updates map on scope bounds changed', function() {
    scope.pBounds = {
      southWest: { lat: 8, lng: 9 },
      northEast: { lat: 10, lng: 11 }
    };
    scope.$digest();
    expect(mapCtrl.bounds).toEqual(new google.maps.LatLngBounds(
        new google.maps.LatLng(8, 9),
        new google.maps.LatLng(10, 11)));
  });


  it('does not update map when scope properties set to null', function() {
    scope.pCenter = null;
    scope.pZoom = null;
    scope.pBounds = null;
    scope.$digest();
    expect(mapCtrl.center).not.toEqual(null);
    expect(mapCtrl.zoom).not.toEqual(null);
    expect(mapCtrl.bounds).not.toEqual(null);
  });


});
