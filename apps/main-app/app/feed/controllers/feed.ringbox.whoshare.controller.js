


    angular.module('ringid.feed')
    .controller('FeedRingboxWhoShareController',FeedRingboxWhoShareController);
    FeedRingboxWhoShareController.$inject = ['$controller','$scope','localData'];

    function FeedRingboxWhoShareController($controller, $scope, localData){

        $scope.viewType = 'ringbox';

        $scope.params = localData;


        $controller('FeedWhoShareController', {$scope: $scope} )

    }

