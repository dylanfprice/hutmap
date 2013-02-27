basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  '../../../deps/angular-seed/app/lib/angular/angular.js',
  '../../../deps/angular-seed/app/lib/angular/angular-*.js',
  '../lib/angular/angular-mocks.js',
  '../../js/google-maps/**/*.js',
  'unit/**/*.js'
];

autoWatch = true;

browsers = ['Firefox'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
