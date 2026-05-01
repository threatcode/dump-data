    // THIS DIRECTIVE IS NO LONGER USED MAYBE TODO

angular
    .module('ringid.directives')
    .directive('rgGlobalLoader', rgGlobalLoader);

    //rgGlobalLoader.$inject = ['Auth', '$rootScope'];
    function rgGlobalLoader(){

        //function linkFunc(scope, element) {
            //if (scope.loading) {
                //element[0].style.display = false;
            //} else {
                //element[0].style.display = true;
            //}
        //}

        return {
            restrict: 'E',
            //link: linkFunc,
            //replace: true,
            //scope: {
                //isLoggedIn: '='
            //},
            template:
                    '<div id="global-loader" class="rgbubbling">' +
                        '<span id="rgbubbling_1">' +
                        '</span>' +
                        '<span id="rgbubbling_2">' +
                        '</span>' +
                        '<span id="rgbubbling_3">' +
                        '</span>' +
                    '</div>'
        };
    }

