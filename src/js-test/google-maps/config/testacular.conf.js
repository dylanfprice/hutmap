basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'https://maps.googleapis.com/maps/api/js?sensor=false&libraries=places,geometry&key=AIzaSyDKzNYkeusCcplMH7XWA9l0QLZ8Cwn01_M',
  'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js',
  'http://ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular.min.js',
  '../lib/angular/angular-mocks.js',
  '../../js/google-maps/module.js',
  '../../js/google-maps/**/*.js',
  'unit/**/*.js'
];

autoWatch = true;

browsers = ['Firefox'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
