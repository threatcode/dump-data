'use strict';

// RingID Newsportal Module - Single definition file
// All newsportal-related directives, controllers, services should be added to this module

try {
  angular.module('ringid.newsportal');
} catch (e) {
  angular.module('ringid.newsportal', [
    'ringid.services',
    'ngRoute',
    'ngStorage',
  ]);
}

// Export for use with other files
export default angular.module('ringid.newsportal');
