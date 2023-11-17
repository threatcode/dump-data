/*
 * © Ipvision
 */

	angular
		.module('ringid.chat')
		.controller('ChatMediaUploadController', ChatMediaUploadController);

    ChatMediaUploadController.$inject = ['$scope', 'fileUploadService', 'Utils', '$boxInstance', 'localData', 'SystemEvents'];
        function ChatMediaUploadController($scope, fileUploadService, Utils, $boxInstance, localData, SystemEvents){

            $scope.navSection = 0;

            $scope.sendMedia = function(){

                if( !!$scope.capturedMedia && !!localData.boxId){

                    var uploadFile = fileUploadService.queueFile('chatimage', Utils.dataURLToBlob($scope.capturedMedia));

                    Utils.triggerCustomEvent(SystemEvents.CHAT.BOX_CAM_UPLOAD, { uploadFile : uploadFile, boxId : localData.boxId })

                    $boxInstance.close();

                }
            };


        }



