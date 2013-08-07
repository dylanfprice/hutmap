'use strict';

(function () {
  angular.module('hutmap.controllers').

  controller('FilterCtrl', 
    ['$scope', '$timeout', '$location',
    function($scope, $timeout, $location) {
 
    // filter data binding
    // object keys that start with '$' are excluded from serialization via angular.toJson

    $scope.resetFilters = function() {

      $scope.f = {};

			$scope.f.anySeason = {
        include: true,
      };
      $scope.f.season = {
        summer: false,
        winter: false,
      };
      
      $scope.f.anyShelterType = {
        include: true,
        $tooltip: '',
      };
      $scope.f.shelterType = {
        0: {
          name: 'caves',
          include: false,
          $keywords: ['Cave'],
        },
        1: {
          name: 'huts & yurts',
          include: false,
          $keywords: ['Hut', 'Yurt', 'Chickee', 'Lean-to', 'Wall Tent', 'Shelter'],
          $tooltip: 'Hut, Yurt, Lean-to, Wall tent, etc',
        },
        2: {
          name: 'fire lookouts',
          include: false,
          $keywords: ['Fire Lookout'],
        },
        3: {
          name: 'compounds',
          include: false,
          $keywords: ['Compound', 'Hostel', 'Tea House', 'Lodge', 'Chalet', 'Ranch', 'Farm'],
          $tooltip: 'Lodge, Hostel, Ranch, Farm, etc',
        }
      };

      $scope.f.anyBackcountryAccess = {
        include: true,
        $tooltip: ''
      };
      $scope.f.backcountryAccess = {
        0: {
          name: 'road',
          include: false,
          $tooltip: 'Accessible by car',
          $match: function(hut) {
            return hut.backcountry === 0 ||
              (hut.backcountry === 1 && $scope.f.season.summer);
          }
        },
        1: {
          name: 'trail',
          include: false,
          $tooltip: 'Accessible by trail',
          $match: function(hut) {
            var match = false;
            if (hut.backcountry >= 2) {
              match = hut.access_no_snow.indexOf('Trail') !== -1;
            }
            return match;
          }
        },
        2: {
          name: 'off-trail',
          include: false,
          $tooltip: 'Bushwack, Scramble, Glacier travel, etc',
          $match: function(hut) {
            var match = false;
            if (hut.backcountry >= 2) {
              match = checkKeywords(hut.access_no_snow, 
                  ['Off Trail', 'Bushwack', 'Scramble', 'Glacier']);
            }
            return match;
          }
        },
        3: {
          name: 'snow',
          include: false,
          $tooltip: 'Ski, Snowmobile, etc',
          $match: function(hut) {
            var match = false;
            if (hut.backcountry === 1 && $scope.f.season.winter) {
              match = true;
            } else if (hut.backcountry >= 2) {
              match = checkKeywords(hut.access_no_snow, 
                  ['Snowmobile', 'Cat']);
            }
            return match;
          }
        },
        4: {
          name: 'boat',
          include: false,
          $tooltip: 'Motor Boat, Canoe, etc',
          $match: function(hut) {
            var match = false;
            if (hut.backcountry >= 2) {
              match = checkKeywords(hut.access_no_snow, 
                  ['Boat']);
            }
            return match;
          }
        },
        5: {
          name: 'aircraft',
          include: false,
          $tooltip: 'Helicopter, Plane, etc',
          $match: function(hut) {
            var match = false;
            if (hut.backcountry >= 2) {
              match = checkKeywords(hut.access_no_snow, 
                  ['Plane']);
            }
            return match;
          }
        },
      };

      $scope.f.services = {
        0: {
					name: 'none',
          include: true,
          $tooltip: 'Self-service only'
        },
        1: {
          name: 'transportation',
          include: true,
          $keywords: ['Transportation (Helicopter)', 'Transportation (Snowcat)'],
          $tooltip: 'Helicopter, Snowcat, etc'
        },
        2: {
          name: 'food',
          include: true,
          $keywords: ['Half Board', 'Full Board', 'Stocked Food', 'Breakfast'],
          $tooltip: 'Cooked meals, Stocked food, etc'
        },
        3: {
          name: 'guide',
          include: true,
          $keywords: ['Guide']
        }
      };

      $scope.f.reservations = {
        0: {
          name: 'none',
          include: true,
          $tooltip: '',
          $match: function(hut) {
            return hut.is_fee_person && hut.fee_person_min === 0 &&
              hut.fee_person_max === 0 && !hut.is_fee_hut && !hut.reservations
          }
        },
        1: {
          name: 'shared',
          include: true,
          $tooltip: 'A spot in the hut can be reserved',
          $match: function(hut) {
            return hut.is_fee_person && hut.reservations;
          }
        },
        2: {
          name: 'private',
          include: true,
          $tooltip: 'The whole hut can be reserved',
          $match: function(hut) {
            return hut.is_fee_hut && hut.reservations;
          }
        },
      };

      $scope.f.capacity = {
        min: 0,
        max: 200
      };

      $scope.f.altitude = {
        meters: true,
        min: 0,
        max: 5000
      };
    };

    function setIncludes(filter, include) {
      angular.forEach(filter, function(data) {
        data.include = false;
      });
    }

		$scope.$watch('f.anySeason.include', function(newValue, oldValue) {
      if (newValue) {
        $scope.f.season.summer = false;
        $scope.f.season.winter = false;
      }
    });
    
    $scope.$watch('f.anyShelterType.include', function(newValue, oldValue) {
      if (newValue) {
        setIncludes($scope.f.shelterType, false);
      }
    });

    $scope.$watch('f.anyBackcountryAccess.include', function(newValue, oldValue) {
      if (newValue) {
        setIncludes($scope.f.backcountryAccess, false);
      }
    });

    $scope.$watch('f.anyReservations.include', function(newValue, oldValue) {
      if (newValue) {
        setIncludes($scope.f.reservations, false);
      }
    });

    $scope.sorted = function(filter) {
      var keys = Object.keys(filter);
      keys.sort();
      return keys;
    };

   
    // filter function

    $scope.filter = function() {
      $scope.incLoading();
      $timeout(_filter).then(function() {
        $scope.decLoading();
      });
    };

    function _filter() {
      var filteredHuts = [];
      var filteredHutIds = [];
      var typeKeywords = getKeywords($scope.f.shelterType);
      var serviceKeywords = getKeywords($scope.f.services);
      angular.forEach($scope.huts, function(hut) {
        if (
          matchSeason(hut) &&
          matchShelterType(hut, typeKeywords) &&
          matchBackcountryAccess(hut) &&
          matchServices(hut, serviceKeywords) &&
          matchReservations(hut) &&
          matchCapacity(hut) &&
          matchAltitude(hut)
        ) {
          filteredHuts.push(hut);
          filteredHutIds[hut.id] = hut.id;
        }
      });
      $scope.setFilteredHuts(filteredHuts, filteredHutIds);
      $scope.$broadcast('gmMarkersRedraw', 'huts');
    };

    $scope.$watch('huts', function() {
      $scope.filter();
    });

    
    // filter function helpers
    
    function getKeywords(filter) {
      var keywords = [];
      angular.forEach(filter, function(data) {
        if (data.include) {
          keywords = keywords.concat(data.$keywords);
        }
      });
      return keywords;
    };

    function checkKeywords(values, keywords) {
      var match = false;
      angular.forEach(keywords, function(keyword) {
        if (values.indexOf(keyword) > -1) {
          match = true;
          return;
        }
      });
      return match;
    };

    function checkRange(min, max, hutMin, hutMax) {
      var minInRange = (hutMin <= min &&
          min <= hutMax);
      var maxInRange = (hutMin <= max && max
         <= hutMax);
      var contains = (min <= hutMin &&
          hutMax <= max);
      return minInRange || maxInRange || contains;
    };

    function feetToMeters(value) {
      return value / 3.28084;
    };


    // matchers
   
    function matchSeason(hut) {
      if ($scope.f.anySeason.include) {
      	return true;
      } else {
				return ($scope.f.season.summer && hut.open_summer) || 
							 ($scope.f.season.winter && hut.open_winter);
			}							 
    };

    function matchShelterType(hut, keywords) {
      var matchShelterType = false;
      if ($scope.f.anyShelterType.include) {
        matchShelterType = true;
      } else {
        matchShelterType = checkKeywords(hut.types, keywords);
      }
      return matchShelterType;
    };

    function matchBackcountryAccess(hut) {
      var matchBackcountryAccess = false;
      if ($scope.f.anyBackcountryAccess.include) {
        matchBackcountryAccess = true;
      } else {
        angular.forEach($scope.f.backcountryAccess, function(backcountryAccess) {
          if (backcountryAccess.include && backcountryAccess.$match(hut)) {
            matchBackcountryAccess = true;
            return;
          }
        });
      }
      return matchBackcountryAccess;
    };

    function matchServices(hut, keywords) {
      var matchServices = false;
      if ($scope.f.services[0].include && !hut.has_services && !hut.has_optional_services) {
        return true;
      } else if (keywords.length > 0) {
        if (hut.has_services && hut.services != null) {
          matchServices = checkKeywords(hut.services, keywords);
        }
        // TODO: checkKeywords(hut.optional_services, keywords);
      }
      return matchServices;
    };

    function matchReservations(hut) {
      var matchReservations = false;
      if ($scope.f.reservations[0].include) {
        matchReservations = true;
      } else {
        angular.forEach($scope.f.reservations, function(reservation) {
          if (reservation.include && reservation.$match(hut)) {
            matchReservations = true;
            return;
          }
        });
      }
      return matchReservations;
    };

    function matchCapacity(hut) {
      return checkRange($scope.f.capacity.min, $scope.f.capacity.max,
          hut.capacity_hut_min, hut.capacity_hut_max);
    };

    function matchAltitude(hut) {
      var min = $scope.f.altitude.min;
      var max = $scope.f.altitude.max;
      if (!$scope.f.altitude.meters) {
        min = feetToMeters(min);
        max = feetToMeters(max);
      }
      return min <= hut.altitude_meters &&
        hut.altitude_meters <= max;
    };

    // update browser url from scope
    $scope.$on('updateLocation', function() {
      if ($scope.f) {
        $location.search('f', angular.toJson($scope.f));
      }
    });

    // update scope from browser url
    var updateScope = function() {
      $scope.resetFilters();
      var f = $location.search().f;
      $location.search('f', null);
      if (f != null) {
        $.extend(true, $scope.f, angular.fromJson(f));
      }
      $scope.filter();
    };

    // we update scope from browser url once, at beginning
    updateScope();

  }]);
})();
