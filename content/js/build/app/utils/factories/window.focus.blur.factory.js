    var app;
    app = angular.module('ringid.utils');

    app.factory('windowFocusHandler',windowFocusHandler);
    windowFocusHandler.$inject = ['$window','Utils','$$stackedMap'];


    function windowFocusHandler($window,Utils,$$stackedMap){

        var fns = $$stackedMap.createNew();

        var process = function(){
            fns.doForAll(function(fn){
                fn.call(null);
            });
        };

        $window.onfocus = process;

        return {
            add : function(fn){
                var key = Utils.getUniqueID();
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
    windowBlurHandler.$inject = ['$window','Utils','$$stackedMap'];


    function windowBlurHandler($window,Utils,$$stackedMap){

        var fns = $$stackedMap.createNew();

        var process = function(){
            fns.doForAll(function(fn){
                fn.call(null);
            });
        };

        $window.onblur = process;

        return {
            add : function(fn){
                var key = Utils.getUniqueID();
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

