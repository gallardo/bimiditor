basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'public_html/lib/angular/angular.js',
  'public_html/lib/angular/angular-*.js',
  'public_html/lib/jquery-*.js',
  'test/lib/angular/angular-mocks.js',
  'public_html/js/**/*.js',
  'test/unit/**/*.js'
];

autoWatch = true;

browsers = ['Chrome'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
