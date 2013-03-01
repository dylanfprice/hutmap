describe('googleMapMarkers', function() {
  var elm, scope, mapCtrl; 
  var timeout;

  beforeEach(function() {
    module('google-maps');
    module('google-maps-test');
  });

  beforeEach(inject(function($rootScope, $compile, $timeout, gmtestMapController) {
    // set up scopes
    scope = $rootScope.$new();
    scope.people = [
      {name: '0', lat: 1, lng: 2},
      {name: '3', lat: 4, lng: 5}
    ];
    scope.opts = {
      title: '7'
    };
  
    timeout = $timeout;

    // compile googleMapMarkers directive
    elm = angular.element('<google-map map-id="test" center="center" zoom="zoom" bounds="bounds">' +
                            '<google-map-markers ' +
                              'objects="people"' + 
                              'get-lat-lng="{lat:object.lat,lng:object.lng}"' + 
                              'marker-options="opts"' + 
                              'on-click="selected = {person: object, marker: marker}"' +
                              'on-mouseover="mouseovered = {person: object, marker: marker}">' + 
                            '</google-map-markers>' + 
                            '<gmtest-get-map-controller></gmtest-get-map-controller>' +
                          '</google-map>');

    $compile(elm)(scope);

    mapCtrl = gmtestMapController();
    spyOn(mapCtrl, 'addMarker').andCallThrough();
    spyOn(mapCtrl, 'removeMarker').andCallThrough();
    spyOn(mapCtrl, 'addListener').andCallThrough();

    scope.$digest();
    timeout.flush();
  }));


  it('requires the objects attribute', inject(function($compile) {
    elm = angular.element('<google-map map-id="test2" center="center" zoom="zoom" bounds="bounds">' +
                            '<google-map-markers ' +
                              'get-lat-lng="{lat:object.lat,lng:object.lng}"' + 
                              'marker-options="opts"' + 
                              'on-click="selected = {person: object, marker: marker}"' +
                              'on-mouseover="mouseovered = {person: object, marker: marker}">' + 
                            '</google-map-markers>' + 
                          '</google-map>');

    scope = scope.$new();
    expect(angular.bind(this, $compile(elm), scope)).toThrow();
  }));

  it('requires the getLatLng attribute', inject(function($compile) {
    elm = angular.element('<google-map map-id="test3" center="center" zoom="zoom" bounds="bounds">' +
                            '<google-map-markers ' +
                              'objects="people"' + 
                              'marker-options="opts"' + 
                              'on-click="selected = {person: object, marker: marker}"' +
                              'on-mouseover="mouseovered = {person: object, marker: marker}">' + 
                            '</google-map-markers>' + 
                          '</google-map>');

    scope = scope.$new();
    expect(angular.bind(this, $compile(elm), scope)).toThrow();
  }));


  describe('objects', function() {
    var objToLatLng;

    beforeEach(inject(function(googleMapsUtils) {
      objToLatLng = googleMapsUtils.objToLatLng;
    }));

    it('initializes markers with objects', function() {
      var position1 = objToLatLng(scope.people[0]);
      var position2 = objToLatLng(scope.people[1]);
      expect(mapCtrl.addMarker).toHaveBeenCalledWith({title: jasmine.any(String), position: position1});
      expect(mapCtrl.addMarker).toHaveBeenCalledWith({title: jasmine.any(String), position: position2});
    });

    
    it('updates markers with new objects', function() {
      scope.people.push({name: '6', lat: 7, lng: 8});
      var position = objToLatLng(scope.people[2]);
      scope.$digest();
      expect(mapCtrl.addMarker).toHaveBeenCalledWith({title: jasmine.any(String), position: position});
    });


    it('updates markers with removed objects', function() {
      var person = scope.people.pop();
      scope.$digest();
      expect(mapCtrl.removeMarker).toHaveBeenCalledWith(person.lat, person.lng);
    });


    it('does not add duplicate markers', function() {
      var origLength = scope.people.length;
      scope.people.push({name: '0', lat: 1, lng: 2});
      scope.$digest();
      expect(mapCtrl.addMarker.callCount).toEqual(origLength);
    });


    it('does not add null objects', function() {
      var origLength = scope.people.length;
      scope.people.push(null);
      scope.$digest();
      expect(mapCtrl.addMarker.callCount).toEqual(origLength);
    });
    
  });


  it('uses given marker options', function() {
    expect(mapCtrl.addMarker).toHaveBeenCalledWith({title: '7', position: jasmine.any(Object)});
  });


  it('sets up event handlers for on-* attributes', function() {
    expect(mapCtrl.addListener).toHaveBeenCalledWith(jasmine.any(Object), 'click', jasmine.any(Function));
    expect(mapCtrl.addListener).toHaveBeenCalledWith(jasmine.any(Object), 'mouseover', jasmine.any(Function));
  });

  it('calls event handlers when event fired', function() {
    var person = scope.people[0];
    var marker = mapCtrl.getMarker(person.lat, person.lng);
    var handled = false;
    runs(function() {
      google.maps.event.addListener(marker, 'mouseover', function() {handled = true;});
      google.maps.event.trigger(marker, 'mouseover');
    });
    waitsFor(function() {
      return handled;
    }, 'no mouseover', 500);
    runs(function() {
      scope.$digest();
      timeout.flush();
      expect(scope.mouseovered.person).toEqual(person);
    });
  });
});
