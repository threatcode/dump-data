var RingWorker;
var RingMessageChannel;
try{
    RingMessageChannel = new MessageChannel();
}catch(e){
    RingMessageChannel = new BroadcastChannel('ring_channel')
}

(function(window){
    'use strict';
    function generateTabId(){
      var currentTopId = Cookies.get('top'),current;
               if(!!currentTopId){
                    current = parseInt(currentTopId) + 1;
                    if(current > 255){ // tab id on backend is one byte
                        current = 1;
                    }
               } else {
                    current = 1;
               }
            Cookies.set('top',current);
            return current
    }
    window._cti = generateTabId();//current tab id
    try{
      if (!window.location.origin) { // ie 10 doesnot support location.origin so its watfall
        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
      }
      RingWorker = new Worker(window.location.origin+'/js/worker/com');
    }catch(e){
        console.warn("Your Browser Is Out Dated. Please Update Your Browser To Use RingId");
        RingWorker = {
          addCallback : angular.noop,
          addEventListener : angular.noop,
          postMessage : angular.noop
        };

    }

    RingWorker.FNS = {};
    RingWorker.addCallback = function(notifier,fn,fnContext){
      if(!this.FNS[notifier]){
        this.FNS[notifier] = [];
      }
      fnContext = fnContext || null;
      this.FNS[notifier].push({ctx:fnContext,fn : fn})
    }
    RingWorker.send = function(data,packId,port,flooding){
        if(port && data){
            this.postMessage({
              command : 'SEND',
              packetId : packId,
              data : data,
              flooding:flooding,
              port : port,
              action : data.actn
             });
        }else{
          throw new Error("You must sent data and port");
        }

    };
    RingWorker.addEventListener('message',function(message){
        var fnss,i;
      if(message.data.notifier && this.FNS[message.data.notifier]){
        for(i=0;i<this.FNS[message.data.notifier].length;i++){
            fnss = this.FNS[message.data.notifier][i];
            fnss.fn.call(fnss.ctx,message.data);
        }
      }else{
        
      }
    });

    RingWorker.addCallback("debug",function(message){
          //for(var key in message.m){
            
         // }

    },RingWorker);

    RingWorker.addEventListener('error',function(e){
         
    });

    RingWorker.pushMessage = function(ob, port){
      try{
            if(!!port){
                this.postMessage(ob, port);
            }else{
                this.postMessage(ob);
            }
       }catch(e){
            
       }
    };

    RingWorker.pushMessage({
         command : 'SETTINGS',
         tabId : window._cti,
         url : 'wss://'+ window.location.host +'/DataSocket/' + window._cti,
         aSkey : Cookies.get('sId'),//auth server sId
         sKey : Cookies.get('sessionID'),//session id webserver
         CLIENT_DATA_SIZE : 460
    }, [RingMessageChannel.port1]);

})(window);

