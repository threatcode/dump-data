

    angular.module('ringid.utils')
    .directive('rgLoaderView', rgLoaderView)
    .directive('rgLoaderView1', rgLoaderView1)
    .directive('rgLoaderView2', rgLoaderView2);

    function rgLoaderView(){
        return {
            restrict: 'E',
            replace: true,
            scope : {
                isLoading : '='
            },
            templateUrl: 'templates/partials/loading_view.html'
        };
    }

    function rgLoaderView1(){
        return {
            restrict: 'E',
            replace: true,
            scope : {
                isLoading : '='
            },
            templateUrl: 'templates/partials/loading_view1.html'
        };
    }

    function rgLoaderView2(){
        return {
            restrict: 'E',
            scope : {
                isLoading : '='
            },
            templateUrl: 'templates/partials/loading_view2.html'
        };
    }


