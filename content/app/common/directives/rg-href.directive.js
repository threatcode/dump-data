
    angular
        .module('ringid.directives')
        .directive('rgHref', ['$location', '$route','$rootScope',
            function($location, $route,$rootScope) {
                function clickHandler(value,attrs) {
                            var match = /#/g.exec(value);
                            if(match){
                                match = value.substr(match.index+1);
                            }else{
                                match = value;
                            }
                            if($location.path() == match && attrs.reloadpage === 'true') {
                                $route.reload();
                            }
                            $rootScope.$coreDigest();
                        }
                return function(scope, element, attrs) {
                    var fn;
                    attrs.$observe('rgHref', function(value) {
                        if(fn){
                            element.unbind('click',clickHandler);
                        }

                        if (!value) {
                            element.removeAttr('href');
                            return;
                        }
                        fn = angular.bind(null,clickHandler,value,attrs);
                        element.attr('href', value);
                        element.bind('click',fn);

                    });

                    scope.$on('$destroy',function(){
                        if(fn){
                            element.unbind('click',fn);
                        }

                    });
                }
            }]);


