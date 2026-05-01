/**
 * Feed Wrapper Controllers
 *
 * These controllers are thin wrappers that delegate to base controllers
 * using AngularJS' $controller service for "inheritance".
 *
 * NOTE: This is a code smell from the legacy codebase.
 * TODO: Migrate to AngularJS .component() pattern (available in 1.5+)
 *       or consolidate into a single configurable FeedController
 */

// ==================== SHARE Wrappers ====================

// Ringbox Share - used in ringbox context
angular.module('ringid.feed')
  .controller('feedRingboxShareController', feedRingboxShareController);

feedRingboxShareController.$inject = ['$scope', '$boxInstance', '$controller', 'localData'];
function feedRingboxShareController($scope, $boxInstance, $controller, localData) {
  $scope.params = {
    feed: localData.feed,
    afterShareCallback: $scope.$close,
    showSharePostBox: true,
  };
  $controller('feedShareController', { $scope: $scope });
}

// Inline Share - used in main feed inline sharing
angular.module('ringid.feed')
  .controller('feedInlineShareController', feedInlineShareController);

feedInlineShareController.$inject = ['$scope', '$controller'];
function feedInlineShareController($scope, $controller) {
  $scope.params = {
    feed: $scope.feed,
    afterShareCallback: $scope.closeShareBox,
    showSharePostBox: true,
  };
  $controller('feedShareController', { $scope: $scope });
}

// Media Share - sharing media content
angular.module('ringid.feed')
  .controller('feedMediaShareController', feedMediaShareController);

feedMediaShareController.$inject = ['$scope', '$controller'];
function feedMediaShareController($scope, $controller) {
  $scope.params = { feed: null };
  $scope.afterShareCallback = angular.noop;
  $scope.closeShareBox = function () {
    $scope.$close();
  };
  $scope.autoAdjustScroll = 'false';
}

// NewsPortal Share - sharing from news portal
angular.module('ringid.feed')
  .controller('feedNewsPortalShareController', feedNewsPortalShareController);

feedNewsPortalShareController.$inject = ['$scope'];
function feedNewsPortalShareController($scope) {
  $scope.closeShareBox = function () {
    $scope.$close();
  };
  $scope.afterShareCallback = angular.noop;
  $scope.autoAdjustScroll = 'false';
  $scope.popup = true;
}

// ==================== WHO-SHARE Wrappers ====================

// Ringbox WhoShare - who shared a feed (ringbox context)
angular.module('ringid.feed')
  .controller('FeedRingboxWhoShareController', FeedRingboxWhoShareController);

FeedRingboxWhoShareController.$inject = ['$controller', '$scope', 'localData'];
function FeedRingboxWhoShareController($controller, $scope, localData) {
  $scope.viewType = 'ringbox';
  $scope.params = localData;
  $controller('FeedWhoShareController', { $scope: $scope });
}

// ==================== OTHER Wrappers ====================

// Popup Single Feed - single feed view in popup
angular.module('ringid.feed')
  .controller('PopupSingleFeedController', PopupSingleFeedController);

PopupSingleFeedController.$inject = ['$scope', 'remoteData', '$boxInstance', '$controller', '$$feedMap'];
function PopupSingleFeedController($scope, remoteData, $boxInstance, $controller, $$feedMap) {
  $scope.feed = $$feedMap.create(remoteData.newsFeedList[0]);
  $scope.hideSerial = true;
  $scope.showCommentBox = true;
  $scope.showFeedFullContent = true;
  RingLogger.print(remoteData, 'FEED_MORE');
  $controller('FeedSubController', { $scope: $scope });
}

// Circle Feed - circle/group feed
angular.module('ringid.feed')
  .controller('FeedCircleController', FeedCircleController);

FeedCircleController.$inject = ['$scope', '$controller', '$routeParams', 'OPERATION_TYPES', 'feedFactory'];
function FeedCircleController($scope, $controller, $routeParams, OPERATION_TYPES, feedFactory) {
  var circleId = $routeParams.circleId;
  $scope.pagekey = OPERATION_TYPES.SYSTEM.TYPE_GROUP_NEWS_FEED + '.' + circleId;
  $scope.action = OPERATION_TYPES.SYSTEM.TYPE_GROUP_NEWS_FEED;
  $scope.params = { actn: OPERATION_TYPES.SYSTEM.TYPE_GROUP_NEWS_FEED, grpId: circleId };
  $scope.forAdd = 'circle';
  $scope.shareMenuDisabled = true;
  $controller('FeedMainController', { $scope: $scope });
}

// Dashboard Feed - dashboard view
angular.module('ringid.feed')
  .controller('FeedDashboardController', FeedDashboardController);

FeedDashboardController.$inject = ['$scope', '$controller', 'OPERATION_TYPES', 'Ringalert'];
function FeedDashboardController($scope, $controller, OPERATION_TYPES, Ringalert) {
  $scope.pagekey = OPERATION_TYPES.SYSTEM.TYPE_NEWS_FEED + '.all';
  $scope.action = OPERATION_TYPES.SYSTEM.TYPE_NEWS_FEED;
  $scope.params = { actn: OPERATION_TYPES.SYSTEM.TYPE_NEWS_FEED };
  $scope.forAdd = 'my';
  $controller('FeedMainController', { $scope: $scope });
}
