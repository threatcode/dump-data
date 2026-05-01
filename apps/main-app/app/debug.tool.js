    var RingLogger;
(function(window,console,angular){
    'use strict';


        function RingLoggerCore(className){
            if(RingLogger instanceof RingLoggerCore){
              return RingLogger;
            }

            this.conditions = {};
            this.showFileUrl = false;
            this.tags = {
                AUTH : 'AUTH',
                MEDIA: 'MEDIA',
                UPLOAD : 'UPLOAD',
                CIRCLE : 'CIRCLE',
                FRIEND : 'FRIEND',
                PROFILE : 'PROFILE',
                CHAT : 'CHAT',
                TAG_CHAT : 'TAG_CHAT',
                CONNECTION : 'CONNECTION',
                DEFAULT : 'DEFAULT',
                RECEIVED : 'RECEIVED',
                SEND : 'SEND',
                KEEPALIVE : 'KEEP_ALIVE'
            };

            this.conditions[this.tags.RECEIVED] = false;
            this.conditions[this.tags.SEND] = false;
            this.conditions[this.tags.KEEPALIVE] = false;
            this.conditions[this.tags.AUTH] = false;
            this.conditions[this.tags.MEDIA] = false;
            this.conditions[this.tags.UPLOAD] = false;
            this.conditions[this.tags.CIRCLE] = true;
            this.conditions[this.tags.FRIEND] = false;
            this.conditions[this.tags.PROFILE] = false;
            this.conditions[this.tags.CHAT] = false;
            this.conditions[this.tags.TAG_CHAT] = false;
            this.conditions[this.tags.DEFAULT] = false;
            this.conditions[this.tags.CONNECTION] = false;

            this.tag = className || this.tags.DEFAULT;
            this.colors = {
                log : 'black',
                info : '#555555',
                warn : '#B8860B',
                error : 'red',
                debug : 'blue'
            };
            var that = this;

            function replaceSupplant(str,replaceA){
               return str.replace(/{(\d+)}/g, function(match, number) {
                  return typeof replaceA[number] != 'undefined'
                    ? replaceA[number]
                    : ""
                  ;
                });
            };
            function getErrorObject(){
                 try { throw Error('') } catch(err) { return err; }
            }
            function prepareLogFn( logFn, className,color)
                {
                    /**
                     * Invoke the specified `logFn` with the supplant functionality...
                     */
                    color = color || 'black';
                    if(that.conditions[className] === false){
                      return angular.noop;
                    }
                    var enhancedLogFn = function ( )
                    {

                      function paddZero(v){
                        return v < 10 ? '0'+v : v;
                      }
                            var args = Array.prototype.slice.call(arguments);
                            var ltime  = new Date();
                            var datefnStr = paddZero(ltime.getHours()) + ':'+paddZero(ltime.getMinutes())+':'+paddZero(ltime.getSeconds())+'.'+ltime.getMilliseconds();
                            var realArgs = [];
                            var err = getErrorObject(),
                                caller_line = err.stack.split("\n")[5]||err.stack.split("\n")[4]||err.stack.split("\n")[3]||err.stack.split("\n")[2]||err.stack.split("\n")[1];
                            var index = caller_line.indexOf("at ");
                            var clean = caller_line.slice(index+2, caller_line.length);
                            var fileNameArr = clean.split('/'),fileName = fileNameArr[fileNameArr.length-1];
                            var lineNumberArr = fileName.split(':')[1];fileName = fileName.split('?')[0] + ':'+lineNumberArr;
                            if(that.showFileUrl){
                              fileName = caller_line;
                            }
                            // // prepend a timestamp and optional classname to the original output message
                            // realArgs[0] = '%c'+ datefnStr;
                            // realArgs[realArgs.length] = 'color:grey;';
                            // var colors = [];
                            // colors.push('color:grey;');
                            // if(!!className){
                            //     realArgs[realArgs.length] = '%c'+className;
                            //     realArgs[realArgs.length] = 'color:green;';
                            //     colors.push('color:green;');
                            // }
                            // for(var i=0;i<args.length;i++){
                            //     if(typeof args[i] === 'string'){
                            //       realArgs[realArgs.length] = '%c'+args[i];
                            //       realArgs[realArgs.length] = 'color:'+color+';'
                            //       colors.push('color:'+color+';');
                            //     }else{
                            //         realArgs[realArgs.length] = args[i];
                            //     }

                            // }
                            // realArgs[realArgs.length] = '%c'+fileName;
                            // realArgs[realArgs.length] = 'color:grey;';
                            // colors.push('color:grey;');
                            //realArgs = realArgs.concat(colors)
                            className = className || '::';

                            for(var i=0;i<args.length;i++){
                              if(typeof args[i] !== 'string'){
                                realArgs = ['%c'+datefnStr + " %c" +className,'color:grey;','color:green;'].concat(args);
                                realArgs.push(fileName);
                                logFn.apply( console, realArgs);
                                return;
                              }
                            }


                              // var output = args.reduce(function(prev,cur){
                              //     if(typeof cur !== 'string'){
                              //       cur = JSON.stringify(cur, null, 4);
                              //     }

                              //     return prev + "#" +cur;
                              // });
                              // if(typeof output !== 'string'){
                              //   output = JSON.stringify(output, null, 4);
                              // }
                              realArgs[0] = replaceSupplant("%c{0} %c{1} %c{2} %c{3}", [datefnStr, className, args.join(" "),fileName]);
                              realArgs[realArgs.length] = 'color:grey;';
                              realArgs[realArgs.length] = 'color:green;';
                              realArgs[realArgs.length] = 'color:'+color+';';
                              realArgs[realArgs.length] = 'color:grey;';
                              //realArgs.push(index);

                        logFn.apply( console, realArgs );
                    };

                    // Special... only needed to support angular-mocks expectations
                    enhancedLogFn.logs = [ ];

                    return enhancedLogFn;
            }
            function buildCustomLogger(fn,col){
              return function(){
                var args = Array.prototype.slice.call(arguments),tag;
                    if(args.length > 1){
                      tag = args[args.length-1];
                      args.pop();
                    }else{
                      tag = that.tags.DEFAULT;
                    }
                    return prepareLogFn(fn,tag,col).apply(console,args);
              }
            }


            this.print =  buildCustomLogger(console.log,this.colors.log);
            this.information =  buildCustomLogger(console.info,this.colors.info);
            this.alert =  buildCustomLogger(console.error,this.colors.error);
            this.warning =  buildCustomLogger(console.warn,this.colors.warn);
            this.warningblack =  buildCustomLogger(console.warn,this.colors.log);
            this.infoblack =  buildCustomLogger(console.info,this.colors.log);
            this.debug =  buildCustomLogger(console.debug,this.colors.debug);

            this.infoblack =  buildCustomLogger(console.info,this.colors.log);

            this.dir = function(){
                console.dir.apply(console,arguments);
            };
            
            this.classNameChanged = function(){
                that.print =  buildCustomLogger(console.log,that.colors.log);
                that.log =  that.print;
                that.information =  buildCustomLogger(console.info,that.colors.info);
                that.alert =  buildCustomLogger(console.error,that.colors.error);
                that.error = that.alert;
                that.info = that.information;
                that.warning =  buildCustomLogger(console.warn,that.colors.warn);
                that.warn =  that.warning;
                that.warningblack =  buildCustomLogger(console.warn,that.colors.log);
                that.infoblack =  buildCustomLogger(console.info,that.colors.log);
                that.debug =  buildCustomLogger(console.debug,that.colors.debug);
            }
            this.getInstance = function( className )
                {
                    className = ( className !== undefined ) ? className : this.tag ;

                    return new RingLoggerCore(className);
                };
            this.classNameChanged();
        }


        RingLogger = new RingLoggerCore();


// a helper for debugging
// getWatcher(htmlElement) will return all watcher under its scope including its child as array of objects
 function getWatchers(root) {
  root = angular.element(root || document.documentElement);
  var watcherCount = 0;

  function getElemWatchers(element) {
    var isolateWatchers = getWatchersFromScope(element.data().$isolateScope);
    var scopeWatchers = getWatchersFromScope(element.data().$scope);
    var watchers = scopeWatchers.concat(isolateWatchers);
    angular.forEach(element.children(), function (childElement) {
      watchers = watchers.concat(getElemWatchers(angular.element(childElement)));
    });
    return watchers;
  }

  function getWatchersFromScope(scope) {
    if (scope) {
      return scope.$$watchers || [];
    } else {
      return [];
    }
  }

  return getElemWatchers(root);
}

window.SC = function(el){
  return angular.element(el).scope();
};

window.GF = function (name) {
    return angular.element(document.body).injector().get(name);
};

window.offlineIpSet = function(ip, port){
    var Auth = angular.element(document.body).injector().get('Auth');
    Auth.loginData.oIP = ip;
    Auth.loginData.oPrt = port;
};

window.ar = function(ob, type, requestType,flooding){
    if(!type){
        type = 'request';
    }

    if(!requestType){
        requestType = 5
    }

    GF('$$connector')[type](ob, requestType,flooding);
};

window.boxIpSet = function(boxId, ip, port){
    var box = angular.element(document.body).injector().get('ChatFactory').getBoxByUId(boxId);
    box.ip = ip;
    box.port = port;
};

window.sb = function(el){
    console.log(SC(el).box.value)
}

window.sm = function(el){
    console.log(SC(el).$parent.message)
}

/* For DEBUG START */

// setTimeout(function(){
//   window.CA = {};  
//   window.CA.ChatConnector = GF('ChatConnector');
//   window.CA.tagChatFactory = GF('tagChatFactory');  


//   window.CA.doTagHistoryRequest = function(){

//     var uuid = CA.tagChatFactory.getUUIDPacketId();
//     var ob = CHAT_APP.ChatRequests.getOfflineTagHistoryMessageRequestObject('1458565158010041', 1, 10, uuid)

//     CA.ChatConnector.send(ob); 
//   }
  
//   window.CA.createGroup = function(){
      
//       var requestObject = JSON.parse('{"packetType":108,"userId":"2110010524","tagId":"1464521617010524","tagName":"GROUP NOT CREATINTG","tagPictureUrl":"","tagMembers":[{"userId":"2110010524","fullName":"IbrahimRashid","status":3,"addedBy":"2110010524"},{"userId":"2110010061","fullName":"Atahar Hossain Shajibgsalkjhfdsacvmyjfdcjcjduduvnc","status":1,"addedBy":"2110010524"},{"userId":"2110067258","fullName":"James Cook","status":1,"addedBy":"2110010524"},{"userId":"2110010361","fullName":"Sharif Islam","status":1,"addedBy":"2110010524"},{"userId":"2110010071","fullName":"Anupam gp","status":1,"addedBy":"2110010524"},{"userId":"2110000090","fullName":"A 0069","status":1,"addedBy":"2110010524"},{"userId":"2110010067","fullName":"Wahid_Love_IPvision","status":1,"addedBy":"2110010524"},{"userId":"2110010072","fullName":"à¦®à¦¿à¦¥à¦¿à¦²à¦¾","status":1,"addedBy":"2110010524"},{"userId":"2110066374","fullName":"Media Test","status":1,"addedBy":"2110010524"},{"userId":"2110011082","fullName":"Chandan 10011082","status":1,"addedBy":"2110010524"},{"userId":"2110010086","fullName":"sirat samyoun","status":1,"addedBy":"2110010524"},{"userId":"2110010199","fullName":"masum biswas","status":1,"addedBy":"2110010524"},{"userId":"2110010077","fullName":"iTunes f","status":1,"addedBy":"2110010524"},{"userId":"2110010078","fullName":"à¦¹à¦¾à§à¦¦à¦¾à¦°","status":1,"addedBy":"2110010524"},{"userId":"2110010309","fullName":"âââââà¦­à¦¾à¦²à§ à¦à§à¦²à§","status":1,"addedBy":"2110010524"},{"userId":"2110010122","fullName":"ethyl","status":1,"addedBy":"2110010524"},{"userId":"2110010115","fullName":"New user_0907","status":1,"addedBy":"2110010524"},{"userId":"2110066607","fullName":"Limon test 2","status":1,"addedBy":"2110010524"},{"userId":"2110066609","fullName":"November rain","status":1,"addedBy":"2110010524"},{"userId":"2110010062","fullName":"Ayrin","status":2,"addedBy":"2110010524"},{"userId":"2110010658","fullName":"lamiag","status":2,"addedBy":"2110010524"},{"userId":"2110063639","fullName":"æ","status":2,"addedBy":"2110010524"},{"userId":"2110063637","fullName":"Arya Stark","status":2,"addedBy":"2110010524"},{"userId":"2110063638","fullName":"Valid Session","status":2,"addedBy":"2110010524"},{"userId":"2110065095","fullName":"CR7","status":2,"addedBy":"2110010524"},{"userId":"2110010089","fullName":"Partho Test 34","status":2,"addedBy":"2110010524"},{"userId":"2110010091","fullName":"One Punch Man","status":2,"addedBy":"2110010524"},{"userId":"2110010103","fullName":"Mavis","status":2,"addedBy":"2110010524"},{"userId":"2110012096","fullName":"DevTestF","status":2,"addedBy":"2110010524"},{"userId":"2110010102","fullName":"Dipti","status":2,"addedBy":"2110010524"},{"userId":"2110010132","fullName":"Alamgir Hossain Raj","status":2,"addedBy":"2110010524"},{"userId":"2110010112","fullName":"MM","status":2,"addedBy":"2110010524"},{"userId":"2110066508","fullName":"farzana","status":2,"addedBy":"2110010524"},{"userId":"2110010123","fullName":"RAJ","status":2,"addedBy":"2110010524"},{"userId":"2110010116","fullName":"shaikot","status":2,"addedBy":"2110010524"}],"platform":5,"packetId":"538c2d40-2591-11e6-0000-00007dc4349c","brokenPacketType":119,"sequenceNo":0,"_cTime":1464521678357,"ip":"38.127.68.55","port":1224}'); 

//      var ChatConnector = GF('ChatConnector');
//      ChatConnector.request(requestObject).then(function(response){ console.log(response); });


//   }

// }, 5000);

/* For DEBUG END */




})(window,console,angular);

