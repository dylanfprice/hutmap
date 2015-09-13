(function () {
'use strict';

  angular.module('hutmap.controllers').

  controller('CarouselCtrl', ['$scope', '$http', '$q', function($scope, $http, $q) {
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
          src: hutmap.STATIC_URL + 'img/carousel/th/.jpg',
          credit: '',
          url: ''
        },
        image: {
          src: hutmap.STATIC_URL + 'img/carousel/hires/.jpg',
          credit: '',
          url: ''
        }
      },
      */
      
      {
        title: 'Three Fingers Lookout',
        location: 'North Cascade Range, Washington, USA',
        hutLink: 'map/?h_selected=148&m_center=48.169777,-121.687827&m_zoom=17&m_maptypeid=hybrid',
        hutId: 148,
        agency: {
          name: 'Mount Baker-Snoqualmie National Forest website',
          url: 'http://www.fs.usda.gov/recarea/mbs/recreation/recarea/?recid=17850'
        },
        image: {
          src: hutmap.STATIC_URL + 'img/carousel/hires/130804_4124.jpg',
          credit: 'Ethan Welty',
          url: 'http://weltyphotography.com'
        }
      },
     
     /* PENDING
     {
        title: 'Agnes Vaille Memorial Shelter',
        location: 'Rocky Mountain National Park, Colorado, USA',
        hutLink: '',
        agency: {
          name: '',
          url: ''
        },
        image: {
          src: hutmap.STATIC_URL + 'img/carousel/hires/110719_9094.jpg',
          credit: 'Ethan Welty',
          url: 'http://weltyphotography.com'
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
        image: {
          src: hutmap.STATIC_URL + 'img/carousel/hires/110326_1519.jpg',
          credit: 'Ethan Welty',
          url: 'http://weltyphotography.com'
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
        image: {
          src: hutmap.STATIC_URL + 'img/carousel/hires/100724_5566_pan.jpg',
          credit: 'Ethan Welty',
          url: 'http://weltyphotography.com'
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
        image: {
          src: hutmap.STATIC_URL + 'img/carousel/hires/110405_1067.jpg',
          credit: 'Ethan Welty',
          url: 'http://weltyphotography.com'
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
        image: {
          src: hutmap.STATIC_URL + 'img/carousel/hires/100725_5644.jpg',
          credit: 'Ethan Welty',
          url: 'http://weltyphotography.com'
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
        image: {
          src: hutmap.STATIC_URL + 'img/carousel/hires/110318_0356.jpg',
          credit: 'Ethan Welty',
          url: 'http://weltyphotography.com'
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
        image: {
          src: hutmap.STATIC_URL + 'img/carousel/hires/mcnamara-hut.jpg',
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
        image: {
          src: hutmap.STATIC_URL + 'img/carousel/hires/notch-mountain-shelter-01.jpg',
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
        image: {
          src: hutmap.STATIC_URL + 'img/carousel/hires/camp-muir-03.jpg',
          credit: 'Google'
        }
      },
      
       {
        title: 'Plummer Hut', 
        location: 'Waddington Range, British Columbia, Canada',
        hutLink: '/map/?h_selected=357&m_center=51.388403,-125.062053&m_zoom=9',
        agency: {
          name: 'BC Mountaineering Club website',
          url:  ''
        },
        image: {
          src: hutmap.STATIC_URL + 'img/carousel/hires/plummer-hut.jpg',
          credit: 'Google'
        }
      },
      
      {
        title: 'Joe River Chickee', 
        location: '',
        hutLink: '',
        agency: {
          name: '',
          url:  ''
        },
        image: {
          src: hutmap.STATIC_URL + 'img/carousel/hires/joe-river-chickee.jpg',
          credit: 'Google'
        }
      },
      
      {
        title: 'John Muir Shelter', 
        location: '',
        hutLink: '',
        agency: {
          name: '',
          url:  ''
        },
        image: {
          image: hutmap.STATIC_URL + 'img/carousel/hires/john-muir-shelter.jpg',
          image_credit: 'Google'
        }
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
