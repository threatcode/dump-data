// Main entry point for Vite (ESM)
import angular from 'angular';
import 'angular-route';
import 'angular-animate';
import 'angular-loader';
import 'ngstorage';

// Import app modules dynamically
const modules = import.meta.glob('./**/*.js', { eager: true });

// Load templates into AngularJS $templateCache
import loadTemplates from '@templates/template-loader.js';

// Bootstrap Angular manually
angular.element(document).ready(() => {
  // Load templates before bootstrap
  const injector = angular.injector(['ng', 'ringid']);
  const $templateCache = injector.get('$templateCache');
  loadTemplates($templateCache);
  
  angular.bootstrap(document, ['ringid']);
});
