/**
 * © Ipvision
 */


    angular
        .module('ringid.sticker')

        .directive('rgStickerCategoryList',
        function () {
            return {
                restrict: 'E',
                templateUrl: 'templates/partials/stickers/sticker-category-list.html',
                scope : {
                    categories : '=categories'
                }
            };
        }
    )


