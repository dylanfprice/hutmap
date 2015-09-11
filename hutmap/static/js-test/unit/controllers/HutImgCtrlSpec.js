describe('HutImgCtrl', function() {
  var $rootScope, hutmapScope, hutScope, hutImgScope;
  var huts;

  beforeEach(function() {
    module('hutmap');
  });

  beforeEach(inject(function($httpBackend) {
    $httpBackend.expectGET('/static/data/huts.json').
      respond(hutmap.fixtures.hutdata());
  }));

  beforeEach(inject(function(_$rootScope_, $controller) {
    $rootScope = _$rootScope_;

    hutmapScope = $rootScope.$new();
    var hutmapCtrl = $controller('HutmapCtrl', {$scope: hutmapScope});
    hutScope = hutmapScope.$new();
    var hutCtrl = $controller('HutCtrl', {$scope: hutScope});
    hutImgScope = hutScope.$new();
    var hutImgCtrl = $controller('HutImgCtrl', {$scope: hutImgScope});

    huts = hutmap.fixtures.hutdata().huts;
  }));

  describe('getImgUrl', function() {

    it('retrieves photo_url', function() {
      url = hutImgScope.getImgUrl(huts.object_index['1']);
      expect(url).toEqual(huts.object_index['1'].photo_url);
    });

    it('returns google satellite image on location accuracy 3', function() {
      url = hutImgScope.getImgUrl(huts.object_index['2']);
      expect(url).toMatch(/^http:\/\/maps.googleapis.com/);
    });

    it('returns google satellite image on location accuracy 5', function() {
      hut = huts.object_index['2'];
      hut.location_accuracy = 5;
      url = hutImgScope.getImgUrl(hut);
      expect(url).toMatch(/^http:\/\/maps.googleapis.com/);
    });

    it('returns no image available otherwise', function() {
      url = hutImgScope.getImgUrl(huts.object_index['3']);
      expect(url).toMatch(/.*no-image-available.gif$/);
    });
  });

});
