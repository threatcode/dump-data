

    angular
        .module('ringid.feed')
        .directive('rgPortalNewsFeedBottom',rgPortalNewsFeedBottom); 

        rgPortalNewsFeedBottom.$inject = [];

        function rgPortalNewsFeedBottom() {
            
            return {
                restrict: 'E',
                templateUrl: 'pages/newsportal/portal-bottom.directive.html'
            };
        }

