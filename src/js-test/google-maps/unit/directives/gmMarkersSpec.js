describe('gmMarkers', function() {
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
    scope.mapId = 'test';
  
    timeout = $timeout;

    // compile googleMapMarkers directive
    elm = angular.element('<gm-map gm-map-id="mapId" gm-center="center" gm-zoom="zoom" gm-bounds="bounds">' +
                            '<gm-markers ' +
                              'gm-objects="people"' + 
                              'gm-get-lat-lng="{lat:object.lat,lng:object.lng}"' + 
                              'gm-marker-options="opts"' + 
                              'gm-event="markerEvent"' +
                              'gm-on-click="selected = {person: object, marker: marker}"' +
                              'gm-on-mouseover="mouseovered = {person: object, marker: marker}">' + 
                            '</gm-markers>' + 
                            '<gmtest-get-map-controller></gmtest-get-map-controller>' +
                          '</gm-map>');

    $compile(elm)(scope);

    mapCtrl = gmtestMapController();
    spyOn(mapCtrl, 'addMarker').andCallThrough();
    spyOn(mapCtrl, 'removeMarker').andCallThrough();
    spyOn(mapCtrl, 'trigger').andCallThrough();
    spyOn(mapCtrl, 'addListener').andCallThrough();

    scope.$digest();
    timeout.flush();
  }));


  it('requires the gmObjects attribute', inject(function($compile) {
    elm = angular.element('<gm-map gm-map-id="mapId" gm-center="center" gm-zoom="zoom" gm-bounds="bounds">' +
                            '<gm-markers ' +
                              'gm-get-lat-lng="{lat:object.lat,lng:object.lng}"' + 
                              'gm-marker-options="opts"' + 
                              'gm-on-click="selected = {person: object, marker: marker}"' +
                              'gm-on-mouseover="mouseovered = {person: object, marker: marker}">' + 
                            '</gm-markers>' + 
                          '</gm-map>');

    scope = scope.$new();
    scope.mapId = 'test2';
    expect(angular.bind(this, $compile(elm), scope)).toThrow();
  }));

  it('requires the gmGetLatLng attribute', inject(function($compile) {
    elm = angular.element('<gm-map gm-map-id="mapId" gm-center="center" gm-zoom="zoom" gm-bounds="bounds">' +
                            '<gm-markers ' +
                              'gm-objects="people"' + 
                              'gm-marker-options="opts"' + 
                              'gm-on-click="selected = {person: object, marker: marker}"' +
                              'gm-on-mouseover="mouseovered = {person: object, marker: marker}">' + 
                            '</gm-markers>' + 
                          '</gm-map>');

    scope = scope.$new();
    scope.mapId = 'test3';
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


    it('updates markers when objects replaced with objects of same length', function() {
      var length = scope.people.length;
      scope.people = [];
      for (var i = 0; i < length; i++) {
        scope.people.push({name: 'new' + i, lat: i, lng: i});
      }
      scope.$digest();
      expect(mapCtrl.removeMarker.calls.length).toEqual(length);
      expect(mapCtrl.addMarker.calls.length).toEqual(length * 2);
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


  it('triggers events', function() {
    var person = scope.people[0];
    var position = new google.maps.LatLng(person.lat, person.lng);
    scope.markerEvent = {
      event: 'click',
      location: position,
    }

    scope.$digest();
    timeout.flush();
    var marker = mapCtrl.trigger.mostRecentCall.args[0];
    var event = mapCtrl.trigger.mostRecentCall.args[1];
    expect(marker.getPosition()).toEqual(position);
    expect(event).toEqual('click');
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
