/**
 * © Ipvision
 */


    angular
        .module('ringid.feed')

        .directive('rgPortalPopupTop', rgPortalPopupTop);

    rgPortalPopupTop.$inject = [];

    function rgPortalPopupTop() {

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
               templateUrl: 'pages/newsportal/portal-popup-top.directive.html'
            }
     }

