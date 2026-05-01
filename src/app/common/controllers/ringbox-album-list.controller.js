/**
 * © Ipvision
 */

angular
    .module('ringid.controllers')
    .controller('RingBoxAlbumlistController', RingBoxAlbumlistController);


RingBoxAlbumlistController.$inject = [ '$scope', '$boxInstance', '$controller', 'localData'];
function RingBoxAlbumlistController($scope, $boxInstance, $controller, localData) {
    /****
     *
     * Extends Basic Album List controller to use in Ringbox
     *
     *
     */

    $scope.close = $boxInstance.close;

    $scope.params = localData;

    $controller('AlbumlistController', {$scope: $scope} );
    //////////////////////////////////


}
