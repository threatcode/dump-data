/**
 * © Ipvision
 */


    angular
        .module('ringid.feed')

        .directive('rgPortalNewsFeedDetails', rgPortalNewsFeedDetails);

    function rgPortalNewsFeedDetails() {
        return {
            restrict: 'E',
            templateUrl: '@templates/newsportal/portal-details.directive.html',
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

