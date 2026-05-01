describe('FeedFactory', function() {
  var FeedFactory, $rootScope, $httpBackend;

  beforeEach(function() {
    angular.mock.module('ringid.feed');
    angular.mock.module('ringid.services');

    angular.mock.inject(function(_FeedFactory_, _$rootScope_) {
      FeedFactory = _FeedFactory_;
      $rootScope = _$rootScope_;
    });
  });

  it('should exist', function() {
    expect(FeedFactory).toBeDefined();
  });

  it('should have getFeeds method', function() {
    expect(typeof FeedFactory.getFeeds).toBe('function');
  });

  it('should have addFeed method', function() {
    expect(typeof FeedFactory.addFeed).toBe('function');
  });

  it('should have deleteFeed method', function() {
    expect(typeof FeedFactory.deleteFeed).toBe('function');
  });

  it('should have updateFeed method', function() {
    expect(typeof FeedFactory.updateFeed).toBe('function');
  });
});
