

    angular
        .module('ringid.feed')

        .directive('rgPortalSingleFeedDetails', rgPortalSingleFeedDetails)
        .controller('singleDetailController',singleDetailController);

        singleDetailController.$inject = ['$scope'];
        function singleDetailController($scope){
            $scope.getImageData = function (image, feed) {

                return function () {
                    return {
                       image: image,
                       feed: feed
                   };
                };
            };
        }

    function rgPortalSingleFeedDetails() {
        return {
            restrict: 'E',
            templateUrl: '@templates/newsportal/portal-single-details.directive.html',
            link: function(scope) {
                scope.$rgDigest();
            },
            controller:singleDetailController

        };
    }


