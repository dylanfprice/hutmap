basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'http://ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular.min.js',
  '../lib/angular/angular-mocks.js',
  '../../js/hutmap/app.js',
  '../../js/hutmap/**/*.js',
  'unit/**/*.js'
];

autoWatch = true;

browsers = ['Firefox'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
