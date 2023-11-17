/**
 * © Ipvision
 */


    angular
        .module('ringid.feed')

        .directive('rgNewsFeedTop', rgNewsFeedTop);

    rgNewsFeedTop.$inject = ['$templateCache'];

    function rgNewsFeedTop($templateCache) {

        return {
                scope : {
                    feed : '=',
                    serial : '=',
                    ddTemplate : '=',
                    actionFeedDropdown : '=',
                    dropdown: '&',
                    hideSerial: '@',
                    showdroparrow: '='
                },
               restrict: 'E',
               template: $templateCache.get('top.html')
            }
     }

