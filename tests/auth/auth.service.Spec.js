describe('AuthService', function() {
  var AuthService, httpBackend, rootScope;

  beforeEach(function() {
    // Load the module
    angular.mock.module('ringid');

    // Inject dependencies
    angular.mock.inject(function(_AuthService_, $httpBackend, $rootScope) {
      AuthService = _AuthService_;
      httpBackend = $httpBackend;
      rootScope = $rootScope;
    });
  });

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function() {
    expect(AuthService).toBeDefined();
  });

  it('should have login method', function() {
    expect(typeof AuthService.login).toBe('function');
  });

  it('should have logout method', function() {
    expect(typeof AuthService.logout).toBe('function');
  });

  it('should have isAuthenticated method', function() {
    expect(typeof AuthService.isAuthenticated).toBe('function');
  });
});
