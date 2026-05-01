/**
 * © Ipvision
 */


    angular
        .module('ringid.feed')

    .directive('rgSingleFeedHeader', rgSingleFeedHeader)
    .directive('rgSingleFeedBody', rgSingleFeedBody)
    .directive('rgSingleFeedMenu', rgSingleFeedMenu)

    function rgSingleFeedBody() {
        return {
            restrict: 'E',
            templateUrl: 'templates/partials/single_feed/body.html'
        };
    }

    function rgSingleFeedHeader() {
        return {
            restrict: 'E',
            templateUrl: 'templates/partials/single_feed/header.html'
        };
    }

    function rgSingleFeedMenu() {
        return {
            restrict: 'E',
            templateUrl: 'templates/partials/single_feed/menu.html'
        };
    }


