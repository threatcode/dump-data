


    angular
        .module('ringid.feed')

        .directive('rgPortalTop', rgPortalTop);
    
    rgPortalTop.$inject = [];

    function rgPortalTop() {
        
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
               templateUrl: '@templates/newsportal/portal-top.directive.html'  
            }
     }


