/**
 * © Ipvision
 */


    angular
        .module('ringid.feed')

        .directive('rgNewsFeedDetails', rgNewsFeedDetails);

    function rgNewsFeedDetails() {
        return {
            restrict: 'E',
            templateUrl: 'templates/partials/news_feed/details.html',
            link: function(scope) {
                scope.$rgDigest();
            }

            //scope : {
            //    feed : '=',
            //    editorEnabled : '=',
            //    inputDisabled : '=',
            //    updateFeed : '&',
            //    cancelEdit : '&',
            //    getImageData: '&',
            //    setFeedText : '=',
            //    feedText : '='
            //
            //}


        };
    }

