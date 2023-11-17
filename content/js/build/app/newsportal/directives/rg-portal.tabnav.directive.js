

    angular
        .module('ringid.newsportal')
        .directive('rgPortalTabNav', rgPortalTabNav);

    rgPortalTabNav.$inject = [ ];
    function rgPortalTabNav( ) { // jshint ignore:line

        tabNavController.$inject = [ '$scope','$location' ];
        function tabNavController ( $scope, $location ) { //jshint ignore:line

            $scope.isCurrentPath = function (path,contain) {
                return contain ?$location.path().indexOf(path) > -1 : $location.path() == path;
            };
      
        }

        var linkFunc = function(scope,element) {
           

        };

        return {
            restrict: 'E',
            controller: tabNavController,
            link: linkFunc,
            templateUrl: 'pages/newsportal/portal.tabnav.directive.html'
        };
    }

