/**
 * © Ipvision
 */


    angular
        .module('ringid.media')
        .directive('rgTabNav', rgTabNav);

    rgTabNav.$inject = [ '$routeParams' ];
    function rgTabNav( $document, Media, $routeParams ) { // jshint ignore:line

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
            templateUrl: 'templates/partials/media.tabnav.dir.html'
        };
    }
