/**
 * © Ipvision
 */

    angular
        .module('ringid.notification')
        .controller('RingBoxImageController', RingBoxImageController);


    RingBoxImageController.$inject = [ '$scope', '$boxInstance', '$controller', 'localData', 'remoteData', 'feedFactory'];
    function RingBoxImageController($scope, $boxInstance, $controller, localData, remoteData, feedFactory) { // jshint ignore:line
        /****
         *
         * Extends Basic Image Popup controller to use in Ringbox
         *
         *
         */



        $scope.close = $boxInstance.close;

        if (localData && localData.imgId) {
            $scope.templateType = localData.templateType;
        }
        $scope.params = localData;
        $scope.remoteData = remoteData;
         if(localData.noti && localData.noti.getCommentId() > 0){
            $scope.activeCommentId = localData.noti.getCommentId();
        }

        $controller('ImageController', {$scope: $scope} );

        //////////////////////////////////

        //----------- Public --------------

    }

