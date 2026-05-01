'use strict';

// RingID Feed Module - Single definition file
// All feed-related directives, controllers, services should be added to this module

try {
  angular.module('ringid.feed');
} catch (e) {
  angular.module('ringid.feed', ['ringid.services', 'ngRoute', 'ngStorage']);
}

// Export for use in other files
export default angular.module('ringid.feed');
