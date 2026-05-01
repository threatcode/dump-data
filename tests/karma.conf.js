module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'node_modules/angular/angular.js',
      'node_modules/angular-route/angular-route.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'apps/main-app/app/**/*.js',
      'packages/scripts/**/*.js',
      'tests/common/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['ChromeHeadless'],

    plugins : [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
