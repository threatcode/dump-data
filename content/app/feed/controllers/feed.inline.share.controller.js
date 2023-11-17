

    angular.module('ringid.feed')
    .controller("feedMediaShareController",feedMediaShareController)
    .controller("feedNewsPortalShareController",feedNewsPortalShareController)
    .controller("feedInlineShareController",feedInlineShareController);

    feedInlineShareController.$inject = ['$scope',  '$controller'];
    function feedInlineShareController($scope, $controller) {

        $scope.params = {
          feed: $scope.feed,
          afterShareCallback : $scope.closeShareBox,//for main inline share close sharebox needed here
          showSharePostBox : true
        };

        $controller('feedShareController', {$scope: $scope});

        ////////////////////////////////////
       /*
        function afterShareCallback(){
            $scope.showShareBox = false;
        }
        */

    }

    feedMediaShareController.$inject = ['$scope','$controller'];
    function feedMediaShareController($scope,$controller){
            $scope.params = {
              feed: null
            };
            $scope.afterShareCallback = angular.noop;
            $scope.closeShareBox = function(){
                $scope.$close();
            };
            $scope.autoAdjustScroll = "false";
    }

    feedNewsPortalShareController.$inject = ['$scope'];
    function feedNewsPortalShareController($scope){
            $scope.closeShareBox = function(){
                $scope.$close();
            };
            $scope.afterShareCallback = angular.noop;
            $scope.autoAdjustScroll = "false";
		    $scope.popup = true;
    }
