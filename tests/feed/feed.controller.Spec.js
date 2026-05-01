describe('FeedController', function() {
  var controller, scope, FeedService, stateParams;

  beforeEach(function() {
    angular.mock.module('ringid.feed');

    angular.mock.inject(function($controller, $rootScope, _FeedService_, $stateParams) {
      scope = $rootScope.$new();
      FeedService = _FeedService_;
      stateParams = $stateParams;

      controller = $controller('FeedController', {
        $scope: scope,
        FeedService: FeedService,
        $stateParams: stateParams
      });
    });
  });

  it('should exist', function() {
    expect(controller).toBeDefined();
  });

  it('should have scope defined', function() {
    expect(scope).toBeDefined();
  });

  it('should initialize feed list', function() {
    expect(scope.feeds).toBeDefined();
  });
});
