'use strict';

(function () {
  angular.module('hutmap.controllers').

  controller('CarouselCtrl', ['$scope', '$route', '$http', '$q', function($scope, $route, $http, $q) {
    $scope.slides = [
      {
        title: 'Plummer Hut', 
        location: 'Waddington Range, British Columbia, Canada',
        hutLink: '/map/?h_selected=357&m_center=51.388403,-125.062053&m_zoom=9',
        agency: {
          name: 'BC Mountaineering Club',
          url:  ''
        },
        thumbnail: hutmap.STATIC_URL + 'hutmap/img/no-image-available.gif',
        image: hutmap.STATIC_URL + 'hutmap/img/carousel/plummer-hut-hires.jpg'
      },
      {
        title: 'Joe River Chickee', 
        location: 'lorem ipsum dolor',
        hutLink: '',
        agency: {
          name: 'lorem ipsum dolor',
          url:  ''
        },
        thumbnail: hutmap.STATIC_URL + 'hutmap/img/no-image-available.gif',
        image: hutmap.STATIC_URL + 'hutmap/img/carousel/joe-river-chickee-hires.jpg'
      },
      {
        title: 'John Muir Shelter', 
        location: 'lorem ipsum dolor',
        hutLink: '',
        agency: {
          name: 'lorem ipsum dolor',
          url:  ''
        },
        thumbnail: hutmap.STATIC_URL + 'hutmap/img/no-image-available.gif',
        image: hutmap.STATIC_URL + 'hutmap/img/carousel/john-muir-shelter-hires.jpg'
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
  }]);

})();
