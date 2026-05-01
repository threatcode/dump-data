/**
 * © Ipvision
 */

    angular
        .module('ringid.media')
        .controller('MediaPostController',MediaPostController);

        MediaPostController.$inject = ['$scope', '$location', 'RING_ROUTES'];
        function MediaPostController ($scope, $location, RING_ROUTES) {

            $scope.setFeed = setFeed;

            function setFeed(json){
                if (!!json && json.sucs === true) {
                    $location.path(RING_ROUTES.MEDIA_FEEDS);
                    $scope.$rgDigest();
                }
            }

        }

