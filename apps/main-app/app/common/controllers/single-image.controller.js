/**
 * © Ipvision
 */

angular
    .module('ringid.controllers')
    .controller('SingleImageController', SingleImageController);


SingleImageController.$inject = ['$scope', '$routeParams', '$controller', 'Auth' ];

function SingleImageController($scope, $routeParams, $controller, Auth) {
    /****
     *
     * Extends Basic Image Popup controller to ReUse the functionality
     *
     *
     *
     */

    $scope.params  = {};
    $scope.params.imgId = $routeParams.imageId;

    $scope.isReady = false;

    $scope.currentUser = Auth.currentUser();

    $controller('ImagePopupController', {$scope: $scope});
    $scope.showCommentBox = true;

}

