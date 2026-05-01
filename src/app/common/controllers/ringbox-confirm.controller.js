/**
 * © Ipvision
 */

angular
    .module('ringid.controllers')
    .controller('RingBoxConfirmController', RingBoxConfirmController);


RingBoxConfirmController.$inject = [ '$scope', '$boxInstance', 'localData'];
function RingBoxConfirmController($scope, $boxInstance, localData) {

    $scope.close = close;
    $scope.params = localData;

    function close(confirmed) {
        $boxInstance.close(confirmed);
    }

}
