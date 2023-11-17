

    angular
        .module('ringid.feed')
        .directive('rgCommonFeedBottom',rgCommonFeedBottom); 

        rgCommonFeedBottom.$inject = [];

        function rgCommonFeedBottom() {
            
            return {
                restrict: 'E',
                templateUrl: function(element,attrs) {
                    return attrs.templatepath;
                } 
            };
        }

