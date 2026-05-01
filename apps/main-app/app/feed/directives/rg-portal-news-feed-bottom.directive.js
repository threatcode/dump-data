

    angular
        .module('ringid.feed')
        .directive('rgPortalNewsFeedBottom',rgPortalNewsFeedBottom); 

        rgPortalNewsFeedBottom.$inject = [];

        function rgPortalNewsFeedBottom() {
            
            return {
                restrict: 'E',
                templateUrl: '@templates/newsportal/portal-bottom.directive.html'
            };
        }

