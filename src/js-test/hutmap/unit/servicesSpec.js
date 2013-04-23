describe('services', function() {

  beforeEach(function() {
    module('hutmap');
  });

  function createHut(id) {
    return {
      id: id,
      location: {
        type: 'Point',
        coordinates: [id + 2, id + 1]
      }, 
      resource_uri: '/huts/api/v1/hut/' + id + '/',
      agency: id,
      region: id,
    };
  }

  beforeEach(inject(function($httpBackend) {
    $httpBackend.expectGET('/static/data/huts.json').
      respond({
        huts: {
          meta: { total_count: 2 },
          object_index: {
            1: createHut(1),
            2: createHut(2)
          }
        },
        agencies: {
          meta: {total_count: 2},
          object_index: {
            1: {
              id: 1,
              name: '1'
            },
            2: {
              id: 2,
              name: '2'
            }
          }
        },
        regions: {
          meta: {total_count: 2},
          object_index: {
            1: {
              id: 1,
              name: '1'
            },
            2: {
              id: 2,
              name: '2'
            }
          }
        }
      });
  }));

  describe('Huts', function() {
    var Huts, $rootScope;

    beforeEach(inject(function(_Huts_, _$rootScope_, $httpBackend) {
      Huts = _Huts_;
      $rootScope = _$rootScope_;
      $httpBackend.flush();
    }));

    afterEach(inject(function($httpBackend) {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    }));

    describe('query', function() {
      it('returns huts in bounds', function() {
        var bounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(0,0),
          new google.maps.LatLng(2,3));
        var huts;

        Huts.query({bounds: bounds}).then(function(_huts_) {
          huts = _huts_;
        });
        $rootScope.$apply(); 
        expect(huts.length).toEqual(1);
      });

      it('does not return huts not in bounds', function() {
        var bounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(0,0),
          new google.maps.LatLng(1,1));
        var huts;

        Huts.query({bounds: bounds}).then(function(_huts_) {
          huts = _huts_;
        });
        $rootScope.$apply(); 
        expect(huts.length).toEqual(0);
      });

      it('returns all huts for limit 0', function() {
        var huts;
        Huts.query({limit: 0}).then(function(_huts_) {
          huts = _huts_;
        });
        $rootScope.$apply();
        expect(huts.length).toEqual(2);
      });

      it('limits the number of huts returned', function() {
        var bounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(0,0),
          new google.maps.LatLng(5,5));
        var huts;
        Huts.query({bounds: bounds, limit: 1}).then(function(_huts_) {
          huts = _huts_;
        });
        $rootScope.$apply();
        expect(huts.length).toEqual(1);
      });
    });

    describe('totalHutCount, hut, agency, region functions', function() {
      it('returns the total hut count', function() {
        var total;
        Huts.totalHutCount().then(function(_total_) { total = _total_; });
        $rootScope.$apply();
        expect(total).toEqual(2);
      });
      it('looks up hut by id', function() {
        var hut;
        Huts.hut(1).then(function(_hut_) { hut = _hut_; });
        $rootScope.$apply();
        expect(hut.id).toEqual(1);
      });
      it('looks up agency by id', function() {
        var agency;
        Huts.agency(1).then(function(_agency_) { agency = _agency_; });
        $rootScope.$apply();
        expect(agency.id).toEqual(1);
      });
      it('looks up region by id', function() {
        var region;
        Huts.region(1).then(function(_region_) { region = _region_; });
        $rootScope.$apply();
        expect(region.id).toEqual(1);
      });
      it('looks up hut by resource_uri', function() {
        var hut;
        Huts.hut(1).then(function(_hut_) {
          Huts.hut(_hut_.resource_uri).then(function(_hut_) {
            hut = _hut_;
          });
        });
        $rootScope.$apply();
        expect(hut.id).toEqual(1);
      });
      it('looks up agency by resource_uri', function() {
        var agency;
        Huts.agency('/huts/api/v1/agency/1/').then(function(_agency_) {
          agency = _agency_;
        });
        $rootScope.$apply();
        expect(agency.id).toEqual(1);
      });
      it('looks up region by resource_uri', function() {
        var region;
        Huts.region('/huts/api/v1/region/1/').then(function(_region_) {
          region = _region_;
        });
        $rootScope.$apply();
        expect(region.id).toEqual(1);
      });

    });

  });

  describe('Places', function() {
    var Places;
    var timeoutMsg = "There should be a result. If you are not connected to the Internet this test will fail (yes it's not really a unit test)."

    beforeEach(inject(function(_Places_) {
      Places = _Places_;
    }));

    describe('getPlacePredictions', function() {
      it('returns 5 predictions', function() {
        var result;
        runs(function() {
          Places.getPlacePredictions('ca',
            function(_result_) {
              result = _result_;
            },
            function(error) {
              console.log(error);
            }
          );
        });

        waitsFor(function() {
          return result;
        }, timeoutMsg, 1000);

        runs(function() {
          expect(result.length).toEqual(5);
        });
      });
    });

    describe('getDetails', function() {
      it('returns details on canada', function() {
        var places;
        runs(function() {
          Places.getPlacePredictions('canada',
            function(_places_) {
              places = _places_;
            });
        });

        waitsFor(function() { return places; }, timeoutMsg, 500);

        runs(function() {
          var place;
          runs(function() {
            Places.getDetails(places[0].reference,
              function(_place_) {
                place = _place_;
              });
          });

          waitsFor(function() { return place; }, timeoutMsg, 500);

          runs(function() {
            expect(place.name).toEqual('Canada');
          });
        });
      });
    });
  });

  describe('utils', function() {
    var utils;

    beforeEach(inject(function(_utils_) {
      utils = _utils_;
    }));

    it('correctly converts url value to latLng', function() {
      var latLng = new google.maps.LatLng(45, -120);
      var urlValue = latLng.toUrlValue();
      expect(utils.latLngFromUrlValue(urlValue)).toEqual(latLng);
    });

    it('correctly creates latLng from hut', function() {
      var hut = createHut(1);
      var latLng = new google.maps.LatLng(2, 3);
      expect(utils.latLngFromHut(hut)).toEqual(latLng);
    });

    it('correctly converts url value to bounds', function() {
      var bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(45, -120),
        new google.maps.LatLng(50, -100));
      var urlValue = bounds.toUrlValue();
      expect(utils.boundsFromUrlValue(urlValue)).toEqual(bounds);
    });
  });

});

