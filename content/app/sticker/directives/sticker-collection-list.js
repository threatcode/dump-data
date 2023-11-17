/**
 * © Ipvision
 */


    angular
        .module('ringid.sticker')

        .directive('rgStickerCollectionList',
        function () {
            return {
                restrict: 'E',
                templateUrl: 'templates/partials/stickers/sticker-collection-list.html',
                scope : {
                    'collections' : '='
                },
                link: function(scope) {

                    scope.currentCollectionIdToShow = 0;

                    scope.shouldShowCollectionCategories = function(collectionId){
                        return scope.currentCollectionIdToShow == collectionId;
                    };

                    scope.showCollectionCategories =  function(collectionId){
                        scope.displayingCollections = !scope.displayingCollections;
                        scope.currentCollectionIdToShow = collectionId;
                        scope.$rgDigest();
                    };

                    scope.displayingCollections = true;
                }
            };
        }
    );


