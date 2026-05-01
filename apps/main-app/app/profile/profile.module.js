'use strict';

// RingID Profile Module - Single definition file
// All profile-related directives, controllers, services should be added to this module

try {
  angular.module('ringid.profile');
} catch (e) {
  angular.module('ringid.profile', ['ringid.services', 'ngRoute', 'ngStorage']);
}

// Export for use in other files
export default angular.module('ringid.profile');
