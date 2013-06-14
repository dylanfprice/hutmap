'use strict';

(function () {
  angular.module('hutmap').

  controller('HutmapCtrl', 
    ['$scope', '$route', function($scope, $route) {

    $scope.$route = $route;

    /**
     *  From: http://yesudeep.wordpress.com/2009/07/25/implementing-a-pythonic-range-function-in-javascript-2/
     *  Behaves just like the python range() built-in function.
     *  Arguments:   [start,] stop[, step]
     * 
     * @start   Number  start value
     * @stop    Number  stop value (excluded from result)
     * @step    Number  skip values by this step size
     *
     * Number.range() -> error: needs more arguments
     * Number.range(4) -> [0, 1, 2, 3]
     * Number.range(0) -> []
     * Number.range(0, 4) -> [0, 1, 2, 3]
     * Number.range(0, 4, 1) -> [0, 1, 2, 3]
     * Number.range(0, 4, -1) -> []
     * Number.range(4, 0, -1) -> [4, 3, 2, 1]
     * Number.range(0, 4, 5) -> [0]
     * Number.range(5, 0, 5) -> []
     * Number.range(5, 4, 1) -> []
     * Number.range(0, 1, 0) -> error: step cannot be zero
     * Number.range(0.2, 4.0) -> [0, 1, 2, 3]
     */
    $scope.range = function() {
      var start, end, step;
      var array = [];

      switch(arguments.length){
        case 0:
          throw new Error('range() expected at least 1 argument, got 0 - must be specified as [start,] stop[, step]');
          return array;
        case 1:
          start = 0;
          end = Math.floor(arguments[0]) - 1;
          step = 1;
          break;
        case 2:
        case 3:
        default:
          start = Math.floor(arguments[0]);
          end = Math.floor(arguments[1]) - 1;
          var s = arguments[2];
          if (typeof s === 'undefined'){
            s = 1;
          }
          step = Math.floor(s) || (function(){ throw new Error('range() step argument must not be zero'); })();
          break;
      }

      if (step > 0){
        for (var i = start; i <= end; i += step){
          array.push(i);
        }
      } else if (step < 0) {
        step = -step;
        if (start > end){
          for (var i = start; i > end + 1; i -= step){
            array.push(i);
          }
        }
      }
      return array;
    }

  }]).

  controller('CarouselCtrl', ['$scope', '$route', '$http', '$q', function($scope, $route, $http, $q) {
    $scope.slides = [
      {
        title: 'Plummer Hut', 
        location: 'Waddington Range, British Columbia, Canada',
        hutLink: '/map/?m_selected=51.37361,-125.16458&m_center=51.388403,-125.062053&m_zoom=9',
        agency: {
          name: 'BC Mountaineering Club',
          url:  ''
        },
        thumbnail: '/static/img/no-image-available.gif',
        image: '/static/img/carousel/Plummer Hut.JPG'
      },
      {
        title: 'Joe River Chickee', 
        location: 'lorem ipsum dolor',
        hutLink: '',
        agency: {
          name: 'lorem ipsum dolor',
          url:  ''
        },
        thumbnail: '/static/img/no-image-available.gif',
        image: '/static/img/carousel/Joe River Chickee.JPG'
      },
      {
        title: 'John Muir Shelter', 
        location: 'lorem ipsum dolor',
        hutLink: '',
        agency: {
          name: 'lorem ipsum dolor',
          url:  ''
        },
        thumbnail: '/static/img/no-image-available.gif',
        image: '/static/img/carousel/John Muir Shelter.JPG'
      }
    ];
    $scope.imgStyle = function(imgUrl) {
      return {
        'background-image': 'url(\'' + imgUrl + '\')'
      }
    };

    // pre-load images
    $scope.carouselInterval = -1;
    var imgsLoaded = [];
    angular.forEach($scope.slides, function(slide, index) {
      imgsLoaded.push($http.get(slide.image));
    });
    $q.all(imgsLoaded).then(function() { $scope.carouselInterval = 8000; });
  }]).

  controller('AlertCtrl', ['$scope', function($scope) {
    // Of the form { type: 'error/warning/info', msg: 'message' }
    $scope.alerts = [
    ];

    $scope.addAlert = function(type, msg) {
      $scope.alerts.push({type:type,msg:msg});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  }]).

  controller('HutInfoCtrl', ['$scope', function($scope) {
    $scope.accuracy_tooltip = [
      'Coordinates provided, but unverifiable.',
      'Wild ass guess.',
      'Slightly better than a wild ass guess.',
      'Found structure on satellite or topo map.',
      'Surveyed with GPS by the Hutmap team.',
      'Found on a map and surveyed by the Hutmap team.'  
    ];

    $scope.mouseoverHut = function(hut) {
      console.log('here');
      $scope.setHutMarkerEvents([{
        event: 'mouseover',
        locations: [new google.maps.LatLng(hut.location.coordinates[1], hut.location.coordinates[0])]
      }]);
    };

    $scope.mouseoutHut = function(hut) {
      $scope.setHutMarkerEvents([{
        event: 'mouseout',
        locations: [new google.maps.LatLng(hut.location.coordinates[1], hut.location.coordinates[0])]
      }]);
    };

    $scope.clickHut = function(hut) {
      $scope.setHutMarkerEvents([{
        event: 'click',
        locations: [new google.maps.LatLng(hut.location.coordinates[1], hut.location.coordinates[0])]
      }]);
    };

  }]).

  controller('HutImgCtrl', ['$scope', function($scope) {
    $scope.getImgUrl = function(hut, width, height) {
      var url = '';
      if (hut) {
        if (hut.photo_url) {
          url = hut.photo_url;
        } else if (!hut.photo_url && hut.accuracy === 3 || hut.accuracy === 5) {
          url = 'http://maps.googleapis.com/maps/api/staticmap' + 
                '?center=' + hut.location.coordinates[1] + '%2C' + hut.location.coordinates[0] +
                '&zoom=19' +
                '&size=' + width + 'x' + height +
                '&maptype=satellite' +
                '&sensor=false' +
                '&key=' + $scope.GOOGLE_API_KEY;
        } else {
          url = $scope.STATIC_URL + 'img/no-image-available.gif';
        }
      }
      return url;
    };

  }]);

})();
