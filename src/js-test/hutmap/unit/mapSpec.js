'use strict';

/* jasmine specs for directives go here */

describe('hutmap.map', function() {
  beforeEach(module('hutmap.gmaps'));

  describe('GMaps', function() {
    var $rootScope;
    var GMaps;

    beforeEach(inject(function(_$rootScope_, _GMaps_) {
      $rootScope = _$rootScope_;
      GMaps = _GMaps_;
    }));

    it('loads the Google Maps API', function() {
      var loaded = false;
      GMaps.loaded.then(function(url) {
        loaded = true;
      });
      $rootScope.$digest();
      expect(loaded).toBeTruthy();
    });

    it('uses the provided api key', function() {
      module(function($provide) {
        //$provide.value('gmapsKey', 'test');
      });
    });

    /*
    it('example', function() {
      module(function($provide) {
        $provide.value('version', 'TEST_VER');
      });
      inject(function($compile, $rootScope) {
        var element = $compile('<span app-version></span>')($rootScope);
        expect(element.text()).toEqual('TEST_VER');
      });
    });
    */
  });
});
