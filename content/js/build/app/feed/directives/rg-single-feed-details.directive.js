
    angular
        .module('ringid.feed')

        .directive('rgSingleFeedDetails', rgSingleFeedDetails);

    function rgSingleFeedDetails() {
        return {
            restrict: 'E',
            templateUrl: 'templates/partials/single_feed/details.html'

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

