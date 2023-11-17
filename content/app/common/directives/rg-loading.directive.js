/**
 * © Ipvision
 */

angular
    .module('ringid.directives')
    .directive('rgLoading', rgLoading);

rgLoading.$inject = ['$rootScope', 'SystemEvents'];
function rgLoading($rootScope, SystemEvents) { //jshint ignore:line

    return {
        restrict: 'E',
        template:
                '<a class="glo-l ng-cloak"> ' +
                    '<span class="load-circle">' +
                        '<span class="ld-cir1 glo-cir"></span>' +
                        '<span class="ld-cir2 glo-cir"></span>' +
                        '<span class="ld-cir3 glo-cir"></span>' +
                        '<span class="ld-cir4 glo-cir"></span>' +
                        '<span class="ld-cir5 glo-cir"></span>' +
                        '<span class="ld-cir6 glo-cir"></span>' +
                        '<span class="ld-cir7 glo-cir"></span>' +
                        '<span class="ld-cir8 glo-cir"></span>' +
                        '<span class="ld-cir9 glo-cir"></span>' +
                        '<span class="ld-cir10 glo-cir"></span>' +
                        '<span class="ld-cir11 glo-cir"></span>' +
                        '<span class="ld-cir12 glo-cir"></span>' +
                    '</span>' +
                    '<span class="glo-type">Processing...</span>' +
                    '</a>' ,
        scope: {
            rgLoadingObj: '='
        },
        link: function(scope, element) {
            $rootScope.$on(SystemEvents.AUTH.LOGIN, function() {
                element[0].style.display = 'none';
                scope.$rgDigest();
            });
            $rootScope.$on(SystemEvents.LOADING, function(event, bool) {
                if (bool) {
                    element[0].style.display = 'block';
                } else {
                    element[0].style.display = 'none';
                }
            });

            element[0].style.display = 'none';
        }
    };
}
