/**
 * © Ipvision
 */

(function() {
    'use strict';

    angular
        .module('ringid.newsportal')
        .controller('portalSaveController',portalSaveController);

        portalSaveController.$inject = ['$scope','$controller','$routeParams','OPERATION_TYPES', 'feedFactory'];
        function portalSaveController ($scope, $controller, $routeParams, OPERATION_TYPES, feedFactory) {

            var feeds = [],
                page= 'newsportal_saved',
                helperob,
                mapkey = OPERATION_TYPES.SYSTEM.TYPE_NEWS_PORTAL_FEED + ".newsportal_saved";

            $scope.pagekey = mapkey;

            // $scope.action = OPERATION_TYPES.SYSTEM.TYPE_NEWS_PORTAL_FEED;

            $scope.params = {actn:OPERATION_TYPES.SYSTEM.TYPE_NEWS_PORTAL_FEED, scl:2,lmt:10,tm:0,svd:true};
            

            $scope.forAdd = page;
            $scope.shareMenuDisabled = true;
            $scope.showPostBox = function(){return false;};
            $scope.showSpecialFeed = function(){return false;};
            $controller('FeedMainController', {$scope: $scope});

        }

})();
