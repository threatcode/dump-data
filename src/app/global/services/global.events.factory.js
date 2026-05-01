/*
 * © Ipvision
 */


    angular
        .module('ringid.global_services')
        .factory('GlobalEvents', GlobalEvents);


    function GlobalEvents(){
        var handlers = {};

        function handleEvent(event) {
            /*
            * http://ringgit.com/ringID/ringIDWeb/issues/99
            *
            * Firefox right click also detect as click
            *
            * */
            if( event.which === 3 || handlers[event.type].length === 0){
                return;
            }


            for(var i = 0, l = handlers[event.type].length; i < l; i++) {
                handlers[event.type][i].call(null, event);
            }
        }


        return {
            bindHandler: function(attachTo, eventName,  handler) {
                if (!handlers.hasOwnProperty(eventName)) {
                    handlers[eventName] = [];
                }

                handlers[eventName].push(handler);
                if(handlers[eventName].length === 1) { // only once bind when handlers goes from 0 to 1
                    switch(attachTo) {
                        case 'document':
                            document.addEventListener(eventName, handleEvent);
                            break;
                        case 'window':
                            window.addEventListener(eventName, handleEvent);
                            break;
                        default:
                            document.addEventListener(eventName, handleEvent);
                    }
                }

            },
            unbindHandler: function(removeFrom, eventName, handler) {
                setTimeout(function() {
                    handlers[eventName].splice( handlers[eventName].indexOf(handler), 1 );
                    if(handlers[eventName].length === 0) { // remove event binding when no handlers present
                        switch(removeFrom) {
                            case 'document':
                                document.removeEventListener(eventName, handleEvent);
                                break;
                            case 'window':
                                window.removeEventListener(eventName, handleEvent);
                                break;
                            default:
                                document.removeEventListener(eventName, handleEvent);
                        }
                    }
                });
            }
        };
    }

