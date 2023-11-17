


    angular
        .module('ringid.feed')

        .directive('rgCommonFeedTop', rgCommonFeedTop);
    
    rgCommonFeedTop.$inject = [];

    function rgCommonFeedTop() {
        
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
                templateUrl: function(element,attrs) {
                    return attrs.templatepath;
                }  
            }
     }


