module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Clean task
    clean: {
      dist: ['dist/css/*.css', 'dist/js/*.js', '!dist/downloads/**', '!dist/scripts/**'],
      build: ['dist/']
    },

    // Copy task for static assets
    copy: {
      fonts: {
        expand: true,
        cwd: 'src/fonts',
        src: '**/*',
        dest: 'dist/fonts/'
      },
      images: {
        expand: true,
        cwd: 'src/images',
        src: '**/*',
        dest: 'dist/images/'
      },
      feature_image: {
        expand: true,
        cwd: 'src/feature-image',
        src: '**/*',
        dest: 'dist/feature-image/'
      }
    },

    // Concat CSS
    concat_css: {
      options: {
        bases: ['src/styles/']
      },
      all: {
        src: [
          'src/styles/**/*.css',
          '!src/styles/**/*.min.css'
        ],
        dest: 'dist/css/styles.min.css'
      }
    },

    // CSS minification - simple approach
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      all: {
        files: {
          'dist/css/styles.min.css': ['dist/css/styles.min.css']
        }
      }
    },

    // Concat JS (exclude worker files - they are loaded separately)
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'bower_components/angular/angular.js',
          'bower_components/angular-route/angular-route.js',
          'bower_components/angular-animate/angular-animate.js',
          'bower_components/angular-loader/angular-loader.js',
          'bower_components/ngstorage/ngStorage.js',
          'src/app/**/*.js',
          'src/scripts/**/*.js',
          '!src/**/worker/**/*.js'
        ],
        dest: 'dist/js/app.min.js'
      }
    },

    // JS uglification
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        mangle: true
      },
      dist: {
        files: {
          'dist/js/app.min.js': ['dist/js/app.min.js']
        }
      }
    },

    // Watch task
    watch: {
      css: {
        files: ['src/styles/**/*.css'],
        tasks: ['cssmin']
      },
      js: {
        files: ['src/app/**/*.js', 'src/scripts/**/*.js'],
        tasks: ['concat', 'uglify']
      },
      templates: {
        files: ['src/templates/**/*.html', 'src/pages/**/*.html'],
        tasks: []  // Reload server or template cache
      }
    },

    // Local development server (using connect)
    connect: {
      options: {
        port: 8080,
        base: '.',
        open: true,
        livereload: true
      }
    },

    // Simple local server without watch (for Codespace)
    express: {
      server: {
        options: {
          port: 8080,
          hostname: '*',
          bases: ['.'],
          livereload: false,
          open: 'http://localhost:8080'
        }
      }
    }
  });

  // Load Grunt plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-concat-css');

  // Default task
  grunt.registerTask('default', ['build']);

  // Build task
  grunt.registerTask('build', [
    'clean:dist',
    'copy',
    'concat_css',
    'cssmin',
    'concat:dist',
    'uglify:dist'
  ]);

  // Local development
  grunt.registerTask('local', [
    'connect:server',
    'watch'
  ]);
};
