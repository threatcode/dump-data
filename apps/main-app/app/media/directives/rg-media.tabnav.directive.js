/**
 * © Ipvision
 */

    angular
        .module('ringid.media')
        .component('rgTabNav', {
            bindings: {},
            controller: ['$location', function($location) {
                var $scope = this;

                $scope.isCurrentPath = function (path, contain) {
                    return contain ? $location.path().indexOf(path) > -1 : $location.path() == path;
                };
            }],
            templateUrl: '@templates/media/tabnav.directive.html',
            restrict: 'E'
        });