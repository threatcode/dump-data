/**
 * © Ipvision
 */

angular
    .module('ringid.controllers')
    .controller('AlbumCreateController', AlbumCreateController);


AlbumCreateController.$inject = ['$scope', 'Media', 'APP_CONSTANTS', '$boxInstance', 'localData'];
function AlbumCreateController($scope,  Media, APP_CONSTANTS, $boxInstance, localData) { // jshint ignore:line

    $scope.albumName = '';
    $scope.createAlbum = function() {
        if ($scope.albumName.length > 0) {
            
            Media.createAlbum({
                albn: $scope.albumName,
                mdaT: localData.mdaT
            }, true).then(function(albumMap) {
                if (albumMap) {
                    $boxInstance.close(albumMap);
                }
            });
        }
    };


}
