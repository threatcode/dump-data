(function () {
    'use strict';
    var app;
    app = angular.module('ringid.utils');

    app.directive('rgKeyUp',function(){
        return function(scope,element,attr){
            function process(e){
                try{
                 scope[attr.rgKeyUp](e);
                 scope.$rgDigest();
                }catch(err){
                     RingLogger.alert(err,"DEBUG");
                }
            }
            element.bind("keyup",process);
            scope.$on('$destroy', function(){
                element.unbind("keyup",process)
            });
         };
    });

    app.directive('rgKeyPress',function(){
        return function(scope,element,attr){
            function process(e){
                try{
                 scope[attr.rgKeyUp](e);
                 scope.$rgDigest();
                }catch(err){
                     RingLogger.alert(err,"DEBUG");
                }
            }
            element.bind("keypress",process);
            scope.$on('$destroy', function(){
                element.unbind("keypress",process)
            });
         };
    });
        
    app.directive('rgScroll',rgScroll);
    rgScroll.$inject = ['utilsFactory','$window'];
    function rgScroll (utilsFactory,$window) {
        return function (scope,element,attr) {

             var wEl = angular.element($window);

             wEl.bind('scroll', function () {

                    requestAnimationFrame(function() {
                      
                          var newValue =utilsFactory.viewportsize();

                          utilsFactory.viewport.x = newValue.x;
                          utilsFactory.viewport.y = newValue.y;
                          utilsFactory.viewport.yo = newValue.yo;
                    });
                  
              });   
        }
    };     

})();
