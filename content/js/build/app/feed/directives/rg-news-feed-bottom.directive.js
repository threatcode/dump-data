/**
 * © Ipvision
 */


    angular
        .module('ringid.feed')
        .directive('rgNewsFeedBottom',rgNewsFeedBottom);

        rgNewsFeedBottom.$inject = ['$templateCache'];

        function rgNewsFeedBottom($templateCache) {

            return {
                restrict: 'E',
                template: $templateCache.get('bottom.html')
            };
        }

