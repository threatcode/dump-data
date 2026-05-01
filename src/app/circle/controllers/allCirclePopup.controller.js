/*
 * © Ipvision
 */

    angular
        .module('ringid.circle')
        .controller('allCirclePopupController', allCirclePopupController);

    allCirclePopupController.$inject = ['$scope', 'OPERATION_TYPES', '$$connector', 'circlesManager', 'rgScrollbarService'];
    function allCirclePopupController($scope, OPERATION_TYPES,  $$connector, circlesManager, rgScrollbarService) { // jshint ignore:line

        var timeOut;
        circlesManager.init();
        $scope.getCircles = getCircles;

        function getCircles(own) {
            if (own === 'true' || own === true) {
                return circlesManager.getCircles(true);
            } else {
                return circlesManager.getCircles(false);
            }
        }

        //$scope.circleList = remoteData.target;
        //console.log($scope.circleList.length);

        // in case user clicks on circle list popup immediately after login. actuall fetch requests is send after 3 sec of successful login
        var circleList = $$connector.subscribe(function() {
            if (!timeOut) {
                timeOut = setTimeout(function() {
                    clearTimeout(timeOut);
                    rgScrollbarService.recalculate($scope);
                    $scope.$rgDigest();
                });
            }
        }, {
            action: [
                OPERATION_TYPES.SYSTEM.CIRCLE.TYPE_GROUP_LIST
            ]
        });

        $scope.$on('$destroy', function() {
            $$connector.unsubscribe(circleList);
        });
    }

