// Karma configuration
// Generated on Wed Jun 17 2015 11:27:44 GMT+0300 (FLE Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon-chai'],

    plugins : [
      "karma-chai",
      "karma-coverage",
      "karma-chrome-launcher",
      "karma-mocha",
      "karma-phantomjs-launcher",
      "karma-sinon-chai",
      "karma-ng-html2js-preprocessor"
    ],

    // list of files / patterns to load in the browser
    files: [
      'app/vendors/angular/angular.js',
      'app/vendors/angular-ui-router/release/angular-ui-router.js',
      'app/vendors/angular-bootstrap/ui-bootstrap-tpls.js',
      'app/vendors/angular-mocks/angular-mocks.js',
      'app/src/app/app.js',
      'app/src/**/!(*.test).js',
      'app/src/**/*.html',
      'app/src/**/*.test.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'app/src/**/!(*.test).js': ['coverage'],
      'app/src/**/*.html': ['ng-html2js']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    coverageReporter : {
      type : 'lcov',
      dir : 'reports/coverage/'
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'app/src/',
      moduleName: 'app'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['PhantomJS', 'Chrome'],
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
