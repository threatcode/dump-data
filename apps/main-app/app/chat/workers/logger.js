"use strict";

var Constants             = CHAT_APP.Constants;
var WORKER_NOTIFIER_TYPES = Constants.WORKER_NOTIFIER_TYPES;

var Logger = {
    log : function(){
        if( arguments.length > 1){
            try{
                postMessage({
                    notifier : WORKER_NOTIFIER_TYPES.DEBUG,
                    m : Array.prototype.slice.call(arguments),
                    type : 'log'
                });
            }catch(e){
                //console.log(e);
            }

        }
    },
    debug : function(){
        if( arguments.length > 1){
            try{
                postMessage({
                    notifier : WORKER_NOTIFIER_TYPES.DEBUG,
                    m : Array.prototype.slice.call(arguments, 1),
                    type : arguments[0]
                });
            }catch(e){
                //console.log(e.message);
            }



        }
    }
};
