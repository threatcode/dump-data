// Main entry point for Vite
import angular from 'angular';
import 'angular-route';
import 'angular-animate';
import 'angular-loader';
import 'ngstorage';

// Import app modules
const appContext = require.context('./', true, /\.js$/);
appContext.keys().forEach(key => {
    if (key !== './main.js') {
        appContext(key);
    }
});

// Bootstrap Angular manually to ensure modules are loaded
angular.element(document).ready(function() {
    angular.bootstrap(document, ['ringid']);
});
