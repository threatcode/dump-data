describe('FeedService', function() {
  var FeedService, $rootScope, $httpBackend;

  beforeEach(function() {
    angular.mock.module('ringid.services');

    angular.mock.inject(function(_FeedService_, _$rootScope_) {
      FeedService = _FeedService_;
      $rootScope = _$rootScope_;
    });
  });

  it('should exist', function() {
    expect(FeedService).toBeDefined();
  });

  it('should have getFeed method', function() {
    expect(typeof FeedService.getFeed).toBe('function');
  });

  it('should have addFeed method', function() {
    expect(typeof FeedService.addFeed).toBe('function');
  });
});
