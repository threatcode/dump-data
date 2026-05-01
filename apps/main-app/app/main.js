// Main entry point for Vite (ESM)
import angular from 'angular';
import 'angular-route';
import 'angular-animate';
import 'angular-loader';
import 'ngstorage';

// Import module definitions first (single source of truth)
import './app.module.js';
import './feed/feed.module.js';
import './profile/profile.module.js';
import './chat/chat.module.js';
import './newsportal/newsportal.module.js';

// Import app modules dynamically
const modules = import.meta.glob('./**/*.js', { eager: true, ignore: ['**/main.js', '**/*.module.js'] });

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
