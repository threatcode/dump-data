/**
 * © Ipvision
 */


    angular
        .module('ringid.global_directives')
        .directive('rgImgLoad', rgImgLoad)
        .directive('rgClick', rgClick)
        .directive('rgConditionalClick', rgConditionalClick);

        rgConditionalClick.$inject = [];

        function rgConditionalClick(){

            return function(scope,elem,attrs){
                if(angular.isFunction(attrs.rgConditionalClick)){
                    elem.bind("click", function(e){
                        attrs.rgConditionalClick();
                    });

                    scope.$on('$destroy',function(){
                        elem.unbind("click");
                    });
                }
            };

        }

        rgClick.$inject = ['$parse'];
        function rgClick($parse) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var fn = $parse(attrs['rgClick']);
                    var noapply = attrs['rgClickNoapply'];
                    function clickfn(event) {
                        //event.preventDefault();
                        //event.stopPropagation();

                        fn(scope, {$event:event});
                        scope.$rgDigest();

                        // if (!noapply) {
                        //     scope.$apply(function() {
                        //         fn(scope, {$event:event});
                        //     });
                        // } else {
                        //     fn(scope, {$event:event});
                        //     scope.$digest();
                        // }

                    }
                    element.bind('click', clickfn);
                    scope.$on('$destroy', function(){
                        element.unbind('click',clickfn);
                    });
                }
            };
        }

        function rgImgLoad() {
            return {
                restrict: 'A',
                transclude: true,
                link: function(scope, element, attrs) {
                    //var imgSrc = element[0].attr('src');
                    //console.log('image source: ' + imgSrc);
                    //element[0].attr('src', '');
                    element.on('load', function () {
                        console.log('image loaded');
                    });
                }
            };
        }


