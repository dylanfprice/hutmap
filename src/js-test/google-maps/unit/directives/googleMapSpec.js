describe('googleMap', function() {
  var elm, scope, mapCtrl; 
  var listeners, listenersOnce;
  var initCenter, initZoom, initBounds;

  beforeEach(function() {
    module('google-maps');
  });


  beforeEach(inject(function($rootScope, $compile, googleMapControllerFactory) {
    // mock MapController
    mapCtrl = jasmine.createSpyObj('MapController', [
      'dragging', 'center', 'zoom', 'bounds', 'addListener', 'addListenerOnce',
      'addMarker', 'hasMarker', 'getMarker', 'removeMarker', 'fitToMarkers']);

    spyOn(googleMapControllerFactory, 'MapController').andCallFake(function() {
      return mapCtrl;
    });
    
    listeners = {};
    listenersOnce = {};
    mapCtrl.addMapListener = createAddListener(listeners);
    mapCtrl.addMapListenerOnce = createAddListener(listenersOnce);

    // set initial state on mock
    mapCtrl.dragging = false;
    mapCtrl.center = new google.maps.LatLng(1, 2);
    mapCtrl.zoom = 3;
    mapCtrl.bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(4, 5),
      new google.maps.LatLng(6, 7));

    initCenter = { lat: 1, lng: 2 };
    initZoom = 3;
    initBounds = {
      southWest: {lat: 4, lng: 5},
      northEast: {lat: 6, lng: 7}
    };

    // compile googleMap directive
    elm = angular.element('<google-map map-id="test" center="pCenter" zoom="pZoom" bounds="pBounds"></google-map>');

    scope = $rootScope.$new();
    $compile(elm)(scope);
    scope.$digest();
  }));


  function createAddListener(listeners) {
    return function(event, handler) {
      if (!(event in listeners)) {
        listeners[event] = [];
      }
      listeners[event].push(handler);
    };
  }


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


  function runListeners(event) {
    angular.forEach(listeners[event], function(val, i) { val(); });
    angular.forEach(listenersOnce[event], function(val, i) { val(); });
    if (event in listenersOnce) {
      delete listenersOnce[event];
    }
  }


  it('updates scope on map initialization', inject(function($timeout) {
    runListeners('bounds_changed');
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

    runListeners('bounds_changed');
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

    runListeners('drag');
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

    runListeners('zoom_changed');
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
