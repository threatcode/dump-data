/*
 * © Ipvision
 */

(function() {
    'use strict';

    angular
        .module('ringid.common.global_events_factory', [])
        .factory('GlobalEvents', GlobalEvents);


    GlobalEvents.$inject = ['$document'];
    function GlobalEvents($document){
        var handlers = [];


        var handleClick = function(event) {
            /*
            * http://ringgit.com/ringID/ringIDWeb/issues/99
            *
            * Firefox right click also detect as click
            *
            * */
            if( event.which === 3 || handlers.length === 0){
                return;
            }


            RingLogger.warn('CLICKED ON WINDOW');
            RingLogger.log(handlers);
            for(var i = 0, l = handlers.length; i < l; i++) {
                handlers[i].call(null, event);
            }
            event.preventDefault();
            //event.stopPropagation();
        };



        return {
            bindHandler: function(attachTo, eventType,  handler) {
                handlers.push(handler);
                if(handlers.length === 1) { // only once bind when handlers goes from 0 to 1
                    $document.bind('click', handleClick);
                }

            },
            unbindHandler: function(removeFrom, eventType, handler) {
                setTimeout(function() {
                    handlers.splice( handlers.indexOf(handler), 1 );
                    if(handlers.length === 0) { // remove event binding when no handlers present
                        $document.unbind('click', handleClick);
                    }
                });
            }
        };
    }


})();
