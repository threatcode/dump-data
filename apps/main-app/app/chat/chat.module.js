'use strict';

// RingID Chat Module - Single definition file
// All chat-related directives, controllers, services should be added to this module

try {
  angular.module('ringid.chat');
} catch (e) {
  angular.module('ringid.chat', [
    'ringid.services',
    'ngRoute',
    'ngStorage'
  ]);
}

// Export for use in other files
export default angular.module('ringid.chat');
