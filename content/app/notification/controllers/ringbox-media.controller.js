/**
 * © Ipvision
 */

    angular
        .module('ringid.notification')
        .controller('RingBoxMediaController', RingBoxMediaController);


    RingBoxMediaController.$inject = [ '$scope', '$boxInstance', '$controller', 'localData', 'remoteData', 'Media'];
    function RingBoxMediaController($scope, $boxInstance, $controller, localData, remoteData, Media) {
        /****
         *
         * Extends Basic Image Popup controller to use in Ringbox
         *
         *
         */

        $scope.close = close;
        RingLogger.log(remoteData, RingLogger.tags.MEDIA);
        if (localData && localData.mediaId) {
            $scope.templateType = localData.templateType;
        }
        RingLogger.information(localData, RingLogger.tags.MEDIA);
        //var noti = notificationFactory.getNotification(localData.notiKey||0);
        $scope.params = localData;
        $scope.remoteData = remoteData;



        $controller('MediaController', {$scope: $scope} );
        //////////////////////////////////

        //----------- Public --------------
        $scope.destroyPlayer = angular.noop;
        function close() {
            $scope.destroyPlayer();
            $boxInstance.close();
        }

    }


