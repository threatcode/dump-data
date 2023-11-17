/**
 *
 * © Ipvision
 */


    angular
        .module('ringid.sticker')
        .controller('StickerPopupController', StickerPopupController);

        StickerPopupController.$inject = ['$boxInstance', 'localData', '$scope', 'StickerFactory'];
        function StickerPopupController($boxInstance, localData, $scope, StickerFactory) { // jshint ignore:line

            $scope.stickerCategories = StickerFactory.getStickerCategories();
            RingLogger.print($scope.stickerCategories, RingLogger.tags.STICKER);

            $scope.stickerCollections = StickerFactory.getStickerCollections();

            if (localData && localData.stickerKey) {
                $scope.sticker = StickerFactory.getStickerCategoryObject(localData.stickerKey);
                $scope.$rgDigest();
            }

            $scope.addSticker = function(sticker) {
                StickerFactory.addMySticker(sticker.getKey());
                $scope.$rgDigest();
            };

            $scope.removeSticker = function(sticker) {
                StickerFactory.removeMySticker(sticker.getKey());
                $scope.$rgDigest();
            };

            $scope.isInstalled = function(stickerId){
                return StickerFactory.isDownloaded(stickerId);
            };

            $scope.close = function($event){
                $boxInstance.close();
                if($event){
                    $event.preventDefault();
                    $event.stopPropagation();
                }
            };

            //$scope.showsticker = true;

        }
