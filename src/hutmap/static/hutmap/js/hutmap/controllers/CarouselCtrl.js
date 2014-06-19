(function () {
'use strict';

  angular.module('hutmap.controllers').

  controller('CarouselCtrl', ['$scope', '$route', '$http', '$q', function($scope, $route, $http, $q) {
    $scope.slides = [
    
    /* TEMPLATE
      {
        title: '',
        location: '',
        hutLink: '',
        agency: {
          name: '',
          url: ''
        },
        thumbnail: {
          src: hutmap.STATIC_URL + 'hutmap/img/carousel/th/.jpg',
          credit: ''
        },
        image: {
          src: hutmap.STATIC_URL + 'hutmap/img/carousel/hires/.jpg',
          credit: ''
        }
      },
      */
      
      {
        title: 'Three Fingers Lookout',
        location: 'North Cascade Range, Washington, USA',
        hutLink: '',
        agency: {
          name: 'Mount Baker-Snoqualmie National Forest website',
          url: 'http://www.fs.usda.gov/recarea/mbs/recreation/recarea/?recid=17850'
        },
        thumbnail: {
          src: '',
          credit: ''
        },
        image: {
          src: hutmap.STATIC_URL + 'hutmap/img/carousel/hires/130804_4124.JPG',
          credit: 'Ethan Welty'
        }
      },
     
     {
        title: 'Agnes Vaille Memorial Shelter',
        location: 'Rocky Mountain National Park, Colorado, USA',
        hutLink: '',
        agency: {
          name: '',
          url: ''
        },
        thumbnail: {
          src: '',
          credit: ''
        },
        image: {
          src: hutmap.STATIC_URL + 'hutmap/img/carousel/hires/110719_9094.JPG',
          credit: 'Ethan Welty'
        }
      },
      
      {
        title: 'North Pole Hut',
        location: 'San Juan Mountains, Colorado, USA',
        hutLink: '',
        agency: {
          name: 'San Juan Hut Systems website',
          url: 'http://www.sanjuanhuts.com/ski-nordic-adventures/north-pole/'
        },
        thumbnail: {
          src: '',
          credit: ''
        },
        image: {
          src: hutmap.STATIC_URL + 'hutmap/img/carousel/hires/110326_1519.JPG',
          credit: 'Ethan Welty'
        }
      },
      
      {
        title: 'Hidden Lake Lookout',
        location: 'North Cascade Range, Washington, USA',
        hutLink: '',
        agency: {
          name: 'Mount Baker-Snoqualmie National Forest website',
          url: 'http://www.fs.usda.gov/recarea/mbs/recreation/recarea/?recid=17672'
        },
        thumbnail: {
          src: '',
          credit: ''
        },
        image: {
          src: hutmap.STATIC_URL + 'hutmap/img/carousel/hires/100724_5566_pan.JPG',
          credit: 'Ethan Welty'
        }
      },
      
      {
        title: 'Wild Horse Window',
        location: 'San Rafael Swell, Utah, USA',
        hutLink: '',
        agency: {
          name: '',
          url: ''
        },
        thumbnail: {
          src: '',
          credit: ''
        },
        image: {
          src: hutmap.STATIC_URL + 'hutmap/img/carousel/hires/110405_1067.JPG',
          credit: 'Ethan Welty'
        }
      },
      
      {
        title: 'Lookout Mountain Lookout',
        location: 'North Cascade Range, Washington, USA',
        hutLink: '',
        agency: {
          name: 'Mount Baker-Snoqualmie National Forest website',
          url: 'http://www.fs.usda.gov/recarea/mbs/recreation/recarea/?recid=17674'
        },
        thumbnail: {
          src: '',
          credit: ''
        },
        image: {
          src: hutmap.STATIC_URL + 'hutmap/img/carousel/hires/100725_5644.JPG',
          credit: 'Ethan Welty'
        }
      },
      
      {
        title: 'Lower Montgomery Pass Yurt',
        location: 'Never Summer Range, Colorado, USA',
        hutLink: '',
        agency: {
          name: 'Never Summer Nordic website',
          url: 'http://neversummernordic.com/MontgomeryPass.htm'
        },
        thumbnail: {
          src: '',
          credit: ''
        },
        image: {
          src: hutmap.STATIC_URL + 'hutmap/img/carousel/hires/110318_0356.JPG',
          credit: 'Ethan Welty'
        }
      },
      
      {
        title: 'McNamara Hut',
        location: 'Sawatch Range, Colorado, USA',
        hutLink: '',
        agency: {
          name: '10th Mountain Division Hut Association website',
          url: 'http://www.huts.org/The_Huts/mcnamara.html'
        },
        thumbnail: {
          src: '', //'http://www.hutmap.com/media/huts/US/Colorado/McNamara%20Hut/photo_200x200_2.jpeg',
          credit: ''
        },
        image: {
          src: hutmap.STATIC_URL + 'hutmap/img/carousel/hires/mcnamara-hut.JPG',
          credit: 'Google'
        }
      },
      
      {
        title: 'Notch Mountain Shelter',
        location: 'Sawatch Range, Colorado, USA',
        hutLink: '',
        agency: {
          name: '',
          url: ''
        },
        thumbnail: {
          src: '',
          credit: ''
        },
        image: {
          src: hutmap.STATIC_URL + 'hutmap/img/carousel/hires/notch-mountain-shelter-01.JPG',
          credit: 'Google'
        }
      },
      
      {
        title: 'Camp Muir Shelter',
        location: 'Mount Rainier National Park, Washington, USA',
        hutLink: '',
        agency: {
          name: 'Mount Rainier National Park website',
          url: 'http://www.nps.gov/mora/planyourvisit/climbing.htm'
        },
        thumbnail: {
          src: '', //http://hutmap.com/media/huts/US/Washington/Camp%20Muir%20Shelter/photo_200x200_2.jpeg',
          credit: '' //'Mitch Barrie'
        },
        image: {
          src: hutmap.STATIC_URL + 'hutmap/img/carousel/hires/camp-muir-03.JPG',
          credit: 'Google'
        }
      },
      
      /* OLD
       {
        title: 'Plummer Hut', 
        location: 'Waddington Range, British Columbia, Canada',
        hutLink: '/map/?h_selected=357&m_center=51.388403,-125.062053&m_zoom=9',
        agency: {
          name: 'BC Mountaineering Club',
          url:  ''
        },
        thumbnail: {
          src: hutmap.STATIC_URL + 'hutmap/img/no-image-available.gif',
          credit: 'Obadiah Reid'
        },
        image: {
          src: hutmap.STATIC_URL + 'hutmap/img/carousel/plummer-hut-hires.jpg',
          credit: 'Google Earth'
        }
      }
      
      {
        title: 'Joe River Chickee', 
        location: 'lorem ipsum dolor',
        hutLink: '',
        agency: {
          name: 'lorem ipsum dolor',
          url:  ''
        },
        thumbnail: hutmap.STATIC_URL + 'hutmap/img/no-image-available.gif',
        thumbnail_credit: '',
        image: hutmap.STATIC_URL + 'hutmap/img/carousel/joe-river-chickee-hires.jpg',
        image_credit: '&copy; Google Earth'
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
        thumbnail_credit: '',
        image: hutmap.STATIC_URL + 'hutmap/img/carousel/john-muir-shelter-hires.jpg',
        image_credit: '&copy; Google Earth'
      }
    
    */

    ];

    $scope.slides.reverse();

    $scope.imgStyle = function(imgUrl) {
      return {
        'background-image': 'url(\'' + imgUrl + '\')'
      }
    };

    $scope.carouselConfig = {
      interval: -1,
    };

  }]);

})();
