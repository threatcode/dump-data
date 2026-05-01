'use strict';

// RingID Main Module - Single definition file
// All app-related directives, controllers, services should be added to this module

try {
  angular.module('ringid');
} catch (e) {
  angular.module('ringid', [
    'ngRoute',
    'ngStorage',
    'ringid.feed',
    'ringid.profile',
    'ringid.chat',
    'ringid.newsportal',
    'ringid.services'
  ]);
}

// Export for use in other files
export default angular.module('ringid');
