module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'node_modules/angular/angular.js',
      'node_modules/angular-route/angular-route.js',
      'node_modules/angular-mocks/angular-mocks.js',
      // App source files
      'apps/main-app/app/**/*.js',
      'apps/main-app/newsportal/**/*.js',
      'apps/main-app/mobile/**/*.js',
      // Shared packages
      'packages/scripts/**/*.js',
      'packages/templates/template-loader.js',
      // Test files
      'tests/common/**/*.js',
      'tests/**/*.Spec.js',
      'tests/**/*.spec.js'
    ],

    preprocessors: {
      'apps/main-app/app/**/*.js': ['coverage'],
      'packages/scripts/**/*.js': ['coverage']
    },

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['ChromeHeadless'],

    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
      }
    },

    plugins : [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-junit-reporter',
      'karma-coverage'
    ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },

    coverageReporter: {
      type: 'html',
      dir: 'coverage/',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },

    singleRun: true,

    reporters: ['progress', 'junit', 'coverage']

  });
};
