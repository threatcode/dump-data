

    angular
        .module('ringid.feed')

        .directive('rgCommonFeedDetails', rgCommonFeedDetails);

    function rgCommonFeedDetails() {
        return {
            restrict: 'E',
            templateUrl: function(element,attrs) {
                    return attrs.templatepath;
            }, 
            link: function(scope) {
                scope.$rgDigest();
            }
        };
    }

