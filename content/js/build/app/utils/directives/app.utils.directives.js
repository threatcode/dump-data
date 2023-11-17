

    var app;
    app = angular.module('ringid.utils');

    app.directive('rgKeyUp',function(){
        return function(scope,element,attr){
            function process(e){
                try{
                 scope[attr.rgKeyUp](e);
                 scope.$rgDigest();
                }catch(err){
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
                     
                }
            }
            element.bind("keypress",process);
            scope.$on('$destroy', function(){
                element.unbind("keypress",process)
            });
         };
    });

