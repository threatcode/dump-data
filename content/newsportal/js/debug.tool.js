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
                error : 'red'
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

            this.dir = function(){
                console.dir.apply(console,arguments);
            };
            
            this.classNameChanged = function(){
              that.log = prepareLogFn( console.log,that.tag,that.colors.log);
              that.info = prepareLogFn( console.info,that.tag,that.colors.info);
              that.warn = prepareLogFn( console.warn,that.tag,that.colors.warn);
              that.error = prepareLogFn( console.error,that.tag,that.colors.error);
              that.debug = function(){
                              that.warn("In IE Debug will crash");
                             prepareLogFn( console.debug,that.tag,that.colors.debug).call(console,arguments);
                          };
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
}

})(window,console,angular);

