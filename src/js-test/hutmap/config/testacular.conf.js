basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'http://maps.googleapis.com/maps/api/js?sensor=false&libraries=places,geometry&key=AIzaSyDKzNYkeusCcplMH7XWA9l0QLZ8Cwn01_M',
  'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js',
  'http://ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular.min.js',
  'http://ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular-resource.min.js',
  '../lib/angular/angular-mocks.js',
  '../../js/third-party/**/*.js',
  '../../js/hutmap/app.js',
  '../../js/hutmap/**/*.js',
  'unit/**/*.js'
];

autoWatch = true;

browsers = ['PhantomJS'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
