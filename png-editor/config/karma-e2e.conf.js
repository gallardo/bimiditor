basePath = '../';

files = [
  ANGULAR_SCENARIO,
  ANGULAR_SCENARIO_ADAPTER,
  'test/e2e/**/*.js'
];

//  Enable or disable watching files and executing the tests whenever one of these files changes.
autoWatch = false;

browsers = ['Chrome'];

coverageReporter = {
	// Possible Values:
	// html (default), lcov (lcov and html), lcovonly, text, text-summary, cobertura (xml format supported by Jenkins)
	type: 'html',
	dir: 'coverage/'
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

singleRun = true;

proxies = {
  '/': 'http://localhost:8000/'
};

junitReporter = {
  outputFile: 'test_out/e2e.xml',
  suite: 'e2e'
};
