(function () {
'use strict';

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
          $keywords: ['cave']
        },
        'huts & yurts': {
          include: false,
          $position: 2,
          $keywords: ['hut', 'yurt', 'chickee', 'lean-to', 'wall-tent', 'shelter'],
          $tooltip: 'Hut, Yurt, Lean-to, Wall tent, etc'
        },
        'fire lookouts': {
          include: false,
          $position: 3,
          $keywords: ['fire-lookout']
        },
        'compounds': {
          include: false,
          $position: 4,
          $keywords: ['compound', 'hostel', 'tea-house', 'lodge', 'chalet', 'ranch', 'farm'],
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
              match = checkLabels(hut.access_no_snow, 
                  ['off-trail', 'bushwack', 'scramble', 'glacier']);
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
              match = checkLabels(hut.access_no_snow, 
                  ['snowmobile', 'cat']);
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
              match = checkLabels(hut.access_no_snow, 
                  ['boat']);
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
              match = checkLabels(hut.access_no_snow, 
                  ['plane']);
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
        'transportation': {
          include: true,
          $position: 1,
          $tooltip: 'Helicopter, Snowcat, etc',
          $keywords: ['transportation-(helicopter)', 'transportation-(snowcat)']
        },
        'food': {
          include: true,
          $position: 2,
          $tooltip: 'Cooked meals, Stocked food, etc',
          $keywords: ['half-board', 'full-board', 'stocked-food', 'breakfast', 'catering']
        },
        'guide': {
          include: true,
          $position: 3,
          $keywords: ['guide']
        }
      };

      $scope.f.reservations = {
        'none': {
          include: true,
          $position: 0,
          $tooltip: 'The hut can not be reserved',
          $match: function(hut) {
            return hut.reservations === false;
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
       'unknown': {
          include: true,
          $position: 3,
          $tooltip: 'It is unknown whether the hut can be reserved.',
          $match: function(hut) {
            return hut.reservations === null;
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

    function setOtherIncludes(filter, include) {
      angular.forEach(filter, function(item, name) {
        if (name !== 'any') {
          item.include = include;
        }
      });
    }

    $scope.toggle = function(filter, item) {
      item.include = !item.include;
      var isIncluded = item.include;
      var isAny = item.$name == 'any';
      if (isAny && isIncluded) {
          setOtherIncludes($scope.f[filter], false);
      } else if (isAny && !isIncluded ) {
          setOtherIncludes($scope.f[filter], true);
      } else if (!isAny && isIncluded) {
        if ('any' in $scope.f[filter]) {
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
      angular.forEach($scope.h.huts, function(hut) {
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
      $scope.h.filteredHuts = filteredHuts;
      $scope.h.filteredHutIds = filteredHutIds;
      $scope.$broadcast('gmMarkersUpdate', 'h.huts');
    };

    $scope.$watch('h.huts', function() {
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

    /**
     * @param labels a list of {'identifier': '<identifier>'} objects
     * @param keywords a list of string identifiers
     * @return true if any identifier in the labels is contained in the
     *   keywords
     */
    function checkLabels(labels, keywords) {
      var match = false;
      angular.forEach(labels, function(label) {
        var identifier = label.identifier;
        if (keywords.indexOf(identifier) > -1) {
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
        hut.types.reduce
        return checkLabels(hut.types, keywords);
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
          matchServices = checkLabels(hut.services, keywords);
        }
        if (!matchServices && hut.has_optional_services && hut.optional_services != null) {
          matchServices = checkLabels(hut.optional_services, keywords);
        }
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

    var writeLocation = function() {
      if ($scope.f) {
        $location.search('f', angular.toJson($scope.f));
      }
    };

    var readLocation = function() {
      $scope.resetFilters();
      var f = $location.search().f;
      $location.search('f', null);
      if (f != null) {
        $.extend(true, $scope.f, angular.fromJson(f));
      }
      $scope.filter();
    };

    $scope.$on('writeLocation', writeLocation);

    readLocation();

  }]);
})();
