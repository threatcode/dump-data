/**
 * © Ipvision
 */


    angular
        .module('ringid.feed')

        .directive('rgNewsFeedSharedFeed', rgNewsFeedSharedFeed);

    function rgNewsFeedSharedFeed() {
        return {
            restrict: 'E',
            templateUrl: 'templates/partials/news_feed/shared_feed.html'
        };
    }

