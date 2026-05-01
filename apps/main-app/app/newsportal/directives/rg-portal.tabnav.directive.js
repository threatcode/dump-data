
    angular
        .module('ringid.newsportal')
        .component('rgPortalTabNav', {
            bindings: {},
            controller: ['$location', function($location) {
                var $scope = this;

                $scope.isCurrentPath = function (path, contain) {
                    return contain ? $location.path().indexOf(path) > -1 : $location.path() == path;
                };
            }],
            templateUrl: '@templates/newsportal/portal.tabnav.directive.html',
            restrict: 'E'
        });