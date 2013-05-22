basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'public_html/lib/angular/angular.js',
  'public_html/lib/angular/angular-*.js',
  'public_html/lib/jquery-*.js',
  'test/lib/angular/angular-mocks.js',
  'public_html/js/**/*.js',
  'test/data/**/*.js',
  'test/unit/**/*.js'
];

autoWatch = true;

browsers = ['Chrome'];

coverageReporter = {
  // Possible Values:
  // html (default), lcov (lcov and html), lcovonly, text, text-summary, cobertura (xml format supported by Jenkins)
  type: 'html',
  dir: 'coverage/'
};

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};

// Possible values: LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG
logLevel = LOG_DEBUG;

preprocessors = {
  'public_html/js/**/*.js': 'coverage'
};

// Possible Values: dots, progress, junit, growl, coverage
reporters = [
  'dots',
  'junit',
  'progress',
  'coverage'
];

