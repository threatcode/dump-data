

    angular.module('ringid.feed')
    .controller("feedRingboxShareController",feedRingboxShareController);

    feedRingboxShareController.$inject = ['$scope', '$boxInstance', '$controller', 'localData'];
    function feedRingboxShareController($scope, $boxInstance, $controller, localData ) {

        $scope.params = {
          feed: localData.feed,
          afterShareCallback : $scope.$close,
          showSharePostBox: true
        };

        $controller('feedShareController', {$scope: $scope});

    }

