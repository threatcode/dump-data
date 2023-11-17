/**
 *
 * © Ipvision
 */


    angular
        .module('ringid.shared')
        .controller('MenuController', MenuController);

        MenuController.$inject = ['$scope','$location'];
        function MenuController($scope,$location) { // jshint ignore:line
            $scope.isCurrentPath = function (path,contain) {
                if(path.length==1){
                    return contain ?$location.path().indexOf(path[0]) > -1 : $location.path() == path[0];
                }else{
                    for(var i=0; i<path.length; i++){
                        if($location.path().indexOf(path[i]) > -1){
                            return contain ?$location.path().indexOf(path[i]) > -1 : $location.path() == path[i];
                        }
                    }
                }

            };

        }
