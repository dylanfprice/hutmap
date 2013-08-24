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

      $scope.f.season = {
        'any': {
          include: true,
          $position: 0
        },
        'summer': {
          include: false,
          $position: 1
        },
        'winter': {
          include: false,
          $position: 2,
        }
      };
      
      $scope.f.shelterType = {
        'any': {
          include: true,
          $position: 0,
          $keywords: []
        },
        'caves': {
          include: false,
          $position: 1,
          $keywords: ['Cave']
        },
        'huts & yurts': {
          include: false,
          $position: 2,
          $keywords: ['Hut', 'Yurt', 'Chickee', 'Lean-to', 'Wall Tent', 'Shelter'],
          $tooltip: 'Hut, Yurt, Lean-to, Wall tent, etc'
        },
        'fire lookouts': {
          include: false,
          $position: 3,
          $keywords: ['Fire Lookout']
        },
        'compounds': {
          include: false,
          $position: 4,
          $keywords: ['Compound', 'Hostel', 'Tea House', 'Lodge', 'Chalet', 'Ranch', 'Farm'],
          $tooltip: 'Lodge, Hostel, Ranch, Farm, etc'
        }
      };

      $scope.f.backcountryAccess = {
        'any': {
          include: true,
          $position: 0,
          $match: function(hut) {
            return true;
          }
        },
        'road': {
          include: false,
          $position: 1,
          $tooltip: 'Accessible by car',
          $match: function(hut) {
            return hut.backcountry === 0 ||
              (hut.backcountry === 1 && $scope.f.season.summer.include);
          }
        },
        'trail': {
          include: false,
          $position: 2,
          $tooltip: 'Accessible by trail',
          $match: function(hut) {
            var match = false;
            if (hut.backcountry >= 2) {
              match = hut.access_no_snow.indexOf('Trail') !== -1;
            }
            return match;
          }
        },
        'off-trail': {
          include: false,
          $position: 3,
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
        'snow': {
          include: false,
          $position: 4,
          $tooltip: 'Ski, Snowmobile, etc',
          $match: function(hut) {
            var match = false;
            if (hut.backcountry === 1 && $scope.f.season.winter.include) {
              match = true;
            } else if (hut.backcountry >= 2) {
              match = checkKeywords(hut.access_no_snow, 
                  ['Snowmobile', 'Cat']);
            }
            return match;
          }
        },
        'boat': {
          include: false,
          $position: 5,
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
        'aircraft': {
          include: false,
          $position: 6,
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
        'none': {
          include: true,
          $position: 0,
          $tooltip: 'Self-service only',
          $keywords: []
        },
        'tranpsortation': {
          include: true,
          $position: 1,
          $tooltip: 'Helicopter, Snowcat, etc',
          $keywords: ['Transportation (Helicopter)', 'Transportation (Snowcat)']
        },
        'food': {
          include: true,
          $position: 2,
          $tooltip: 'Cooked meals, Stocked food, etc',
          $keywords: ['Half Board', 'Full Board', 'Stocked Food', 'Breakfast']
        },
        'guide': {
          include: true,
          $position: 3,
          $keywords: ['Guide']
        }
      };

      $scope.f.reservations = {
        'none': {
          include: true,
          $position: 0,
          $tooltip: 'The hut can not be reserved',
          $match: function(hut) {
            return hut.is_fee_person && hut.fee_person_min === 0 &&
              hut.fee_person_max === 0 && !hut.is_fee_hut && !hut.reservations
          }
        },
        'shared': {
          include: true,
          $position: 1,
          $tooltip: 'A spot in the hut can be reserved',
          $match: function(hut) {
            return hut.is_fee_person && hut.reservations;
          }
        },
       'private': {
          include: true,
          $position: 2,
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
      angular.forEach(filter, function(item, name) {
        if (name !== 'any') {
          item.include = false;
        }
      });
    }

    $scope.including = function(filter, item) {
      if (item.include) {
        if (item.$name == 'any') {
          setIncludes($scope.f[filter], false);
        } else if ('any' in $scope.f[filter]) {
          $scope.f[filter]['any'].include = false;    
        }
      }
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
      if ($scope.f.season.any.include) {
      	return true;
      } else {
				return ($scope.f.season.summer.include && hut.open_summer) || 
							 ($scope.f.season.winter.include && hut.open_winter);
			}							 
    };

    function matchShelterType(hut, keywords) {
      if ($scope.f.shelterType.any.include) {
        return true;
      } else {
        return checkKeywords(hut.types, keywords);
      }
    };

    function matchBackcountryAccess(hut) {
      var matchBackcountryAccess = false;
      angular.forEach($scope.f.backcountryAccess, function(backcountryAccess) {
        if (backcountryAccess.include && backcountryAccess.$match(hut)) {
          matchBackcountryAccess = true;
          return;
        }
      });
      return matchBackcountryAccess;
    };

    function matchServices(hut, keywords) {
      var matchServices = false;
      if ($scope.f.services.none.include && !hut.has_services && !hut.has_optional_services) {
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
      angular.forEach($scope.f.reservations, function(reservation) {
        if (reservation.include && reservation.$match(hut)) {
          matchReservations = true;
          return;
        }
      });
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
