/**
 * © Ipvision
 */

    angular
        .module('ringid.auth')
        .controller('RingboxAuthController', RingboxAuthController);


    RingboxAuthController.$inject = [ '$scope', '$boxInstance', '$controller', 'localData'];
    function RingboxAuthController($scope, $boxInstance, $controller, localData) {
        /****
         *
         * Extends Basic Album List controller to use in Ringbox
         *
         *
         */

        $scope.close = $boxInstance.close;
        $scope.closeAll = $boxInstance.closeAll;

        $scope.showLoader = $boxInstance.showLoader;
        $scope.hideLoader = $boxInstance.hideLoader;

        $scope.params = localData;

        $controller('SignInController', {$scope: $scope} );

    }




