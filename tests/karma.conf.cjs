module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'node_modules/angular/angular.js',
      'node_modules/angular-route/angular-route.js',
      'node_modules/angular-mocks/angular-mocks.js',
      // App source files
      'apps/main-app/app/**/*.js',
      'apps/main-app/newsportal/app.js',
      'apps/main-app/mobile/app.js',
      // Shared packages
      'packages/scripts/**/*.js',
      'packages/templates/template-loader.js',
      // Test files
      'tests/common/**/*.js',
      'tests/**/*.Spec.js',
      'tests/**/*.spec.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['ChromeHeadless'],

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
      dir: 'coverage/'
    },

    singleRun: true,

    reporters: ['progress', 'junit', 'coverage']

  });
};
