/**
 * © Ipvision
 */


    angular
        .module('ringid.sticker')
        .directive('rgStickerCategory', rgStickerCategory);

        rgStickerCategory.$inject=['StickerFactory'];

        function rgStickerCategory(StickerFactory) {
            return {
                restrict: 'E',
                templateUrl: 'templates/partials/stickers/sticker-category.html',
                scope : {
                    categories : '=categories'
                },
                link: function(scope) {

                    scope.getStickerCategory = StickerFactory.getStickerCategoryObject;

                    scope.showPreview = function(stickerId) {
                        return function() {
                            return {stickerKey: stickerId};
                        };
                    };

                    scope.isInstalled = function(stickerId){
                        return StickerFactory.isDownloaded(stickerId);
                    };

                    scope.addSticker = function(stickerId) {
                        StickerFactory.addMySticker(stickerId);
                        scope.$rgDigest();
                    };

                    scope.removeSticker = function(stickerId) {
                        StickerFactory.removeMySticker(stickerId);
                        scope.$rgDigest();
                    };


                }
            };
        }

