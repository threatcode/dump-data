(function() {
    'use strict';
    var app;
    app = angular.module('ringid.utils');

    app.factory('windowFocusHandler',windowFocusHandler);
    windowFocusHandler.$inject = ['$window','utilsFactory','$$stackedMap'];


    function windowFocusHandler($window,utilsFactory,$$stackedMap){

        var fns = $$stackedMap.createNew();

        var process = function(){
            fns.doForAll(function(fn){
                fn.call(null);
            });
        };

        $window.onfocus = process;

        return {
            add : function(fn){
                var key = utilsFactory.getUniqueID();
                fns.add(key,fn);
                return key
            },
            remove : function(key){
                return fns.remove(key);
            },
            fire : function(){//to manually fire focus event
                process();
            }

        };
    }
    app.factory('windowBlurHandler',windowBlurHandler);
    windowBlurHandler.$inject = ['$window','utilsFactory','$$stackedMap'];


    function windowBlurHandler($window,utilsFactory,$$stackedMap){

        var fns = $$stackedMap.createNew();

        var process = function(){
            fns.doForAll(function(fn){
                fn.call(null);
            });
        };

        $window.onblur = process;

        return {
            add : function(fn){
                var key = utilsFactory.getUniqueID();
                fns.add(key,fn);
                return key
            },
            remove : function(key){
                return fns.remove(key);
            },
            fire : function(){//to manually fire focus event
                process();
            }

        };
    }

})();