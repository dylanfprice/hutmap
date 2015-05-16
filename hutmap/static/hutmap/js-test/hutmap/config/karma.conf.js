module.exports = function(config) {
  config.set({
    basePath: '../../../',

    files: [
      'https://apis.google.com/js/client.js',
      'https://maps.googleapis.com/maps/api/js?v=3.12&sensor=false&libraries=places',
      'https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular-route.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular-resource.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular-cookies.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular-mocks.js',
      'js/bower_components/AngularGM/angular-gm.js',
      'js/bower_components/angular-bootstrap/ui-bootstrap.js',
      'js/bower_components/select2/select2.js',
      'js/bower_components/angular-ui-select2/src/select2.js',
      'js/bower_components/angularjs-file-upload/angular-file-upload.js',
      'js/hutmap/app.js',
      'js/hutmap/filters.js',
      'js/hutmap/**/module.js',
      'js/hutmap/**/*.js',
      'js-test/hutmap/unit/fixtures.js',
      'js-test/hutmap/unit/**/*.js'
    ],

    frameworks: ['jasmine'],

    autoWatch: true,
    browsers: ['PhantomJS'],
    reportSlowerThan: 500,

    preprocessors: {
      '**/src/**/*.js': 'coverage'
    },

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type : 'html',
      dir : 'js-test/hutmap/coverage/'
    }
  });
};
