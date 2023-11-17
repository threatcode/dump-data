    angular
        .module('ringid.directives')
        .directive('rgSrc', rgSrc);

    function rgSrc(){ //jshint ignore:line
        return {
            restrict : 'A',
            link : function(scope,element,attr){
                if(attr.rgSrc){
                    scope.$watch(attr.rgSrc, function(newValue) {
                        if (newValue === null || newValue === undefined) {
                            element.removeAttr('src');
                        } else {
                            element.attr('src', newValue);
                        }
                    });
                }
            }
        };
    }
