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
      'lib/AngularGM/angular-gm.js',
      'lib/angular-bootstrap/ui-bootstrap.js',
      'lib/select2/select2.js',
      'lib/angular-ui-select2/src/select2.js',
      'lib/angularjs-file-upload/angular-file-upload.js',
      'js/app.js',
      'js/filters.js',
      'js/**/module.js',
      'js/**/*.js',
      'js-test/unit/fixtures.js',
      'js-test/unit/**/*.js'
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
      dir : 'js-test/coverage/'
    }
  });
};
