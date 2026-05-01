/**
 * Unified Auth Service
 * 
 * This is a consolidation point for auth logic scattered across:
 * - app/auth/controllers/
 * - app/global/services/
 * - app/friend/
 * 
 * TODO: During React migration, create a proper auth module
 * See: MIGRATION-PLAN.md
 */

angular.module('ringid.auth')
  .factory('UnifiedAuthService', ['Auth', 'Storage', '$rootScope', '$$connector', 'OPERATION_TYPES',
    function(Auth, Storage, $rootScope, $$connector, OPERATION_TYPES) {
      
      var service = {};
      
      /**
       * Get current user
       */
      service.getCurrentUser = function() {
        return Auth.currentUser();
      };
      
      /**
       * Check if user is logged in
       */
      service.isLoggedIn = function() {
        return Auth.isLoggedIn();
      };
      
      /**
       * Login user
       */
      service.login = function(credentials) {
        return Auth.login(credentials);
      };
      
      /**
       * Logout user
       */
      service.logout = function() {
        return Auth.logout();
      };
      
      /**
       * Check if authentication is pending
       */
      service.isPending = function() {
        return Auth.isPending();
      };
      
      /**
       * Get stored token
       */
      service.getToken = function() {
        return Storage.get('authToken');
      };
      
      /**
       * Store token
       */
      service.setToken = function(token) {
        Storage.set('authToken', token);
      };
      
      /**
       * Clear auth data
       */
      service.clearAuth = function() {
        Storage.remove('authToken');
        Storage.remove('userData');
      };
      
      /**
       * Subscribe to auth state changes
       */
      service.onAuthStateChange = function(callback) {
        $rootScope.$on('AUTH_STATE_CHANGE', function(event, data) {
          callback(data);
        });
      };
      
      return service;
    }
  ]);
