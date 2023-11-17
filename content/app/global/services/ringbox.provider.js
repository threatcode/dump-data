
angular
    .module("ringid.global_services")
    .provider('$ringbox', function () {

        var $ringboxProvider = {
            boxes: [],
            boxeScopes: [],
            boxeDeferred: [],
            template : '<div class="ringbox">'
            					+'<div class="ringbox-overlay"></div>'
    							+'<div class="ringbox-outerContainer">'
        							 +'<div class="ringbox-content ringbox-invisible">'
        							 	+'<div class="ringbox-inner"></div>'
        							 	+'<div class="ringbox-loader"><div class="loader"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div></div>'
        							 +'</div>'
    							 +'</div>'
						+'</div>',
    		    init: function () {
    		       var boxDom = angular.element(this.template);
    		       this.boxes.push(boxDom);
    		       return boxDom;
    		    },
            adjustBoxes: function() {

               for(var i=0;i<this.boxes.length;i++) {
                  this.boxes[i].removeClass('rl_'+i);
               }
               for(var i=0;i<this.boxes.length;i++) {
                  this.boxes[i].addClass('rl_'+i);
               }
            },

            $get: ['$injector', '$rootScope', '$$q', '$templateCache', '$controller','$compile','$document', '$player','$ringhttp','$sniffer','Notification', 'SystemEvents', 'Utils',
                function ($injector, $rootScope, $q, $templateCache, $controller, $compile, $document, $player,$ringhttp,$sniffer, Notification, SystemEvents, Utils) {
                    var $ringbox = {}, $this = this, prefix = $sniffer.vendorPrefix.toLowerCase();

                    function getTemplatePromise(options) {
                        if(options.template){
                          return $q.when(options.template);
                        }
                        var url = angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl;
                        if($templateCache.get(url)){
                            return $q.when($templateCache.get(url));
                        }else{
                          var defer = $q.defer();
                          $ringhttp.get(url).success(function(result){
                                $templateCache.put(url,result);
                                defer.resolve(result);
                             // return result;
                          }).error(function(){
                              defer.reject();
                          });
                          return defer.promise;
                        }

                        // return options.template ? $q.when(options.template) :
                        //     $http.get(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl,
                        //         {cache: $templateCache}).then(function (result) {
                        //             return result.data;
                        //         });
                    }

                  function getResolvePromises(resolves) {
                      var promisesArr = [];
                       angular.forEach(resolves, function (value) {
                            if(angular.isDefined(value.promise)){
                                promisesArr.push(value.promise);
                            } else if (angular.isFunction(value)) {
                                promisesArr.push($q.when($injector.invoke(value)));
                            }else if(angular.isArray(value) || angular.isObject(value)){
                                    promisesArr.push(value);
                            }
                       });
                      return promisesArr;
                   }

                    $ringbox.minimizedBox = {dom:null, scope:null, deferred:null};

                    $ringbox.clear = function (scope, defer, param) {

                      if($this.boxes.length==0) {
                        document.body.className = document.body.className.replace('ringbox-opened','').trim();
                      }

                      if(scope) {
                        scope.$destroy();
                      }

                      if(defer) {
                        defer.resolve.apply(null, param);
                      }

                       /*clear player resource*/
                       if(!$player.miniPlayer.player && $this.boxes.length == 0) {
                          $player.destroyAll();
                       }

                    }

                    $ringbox.close = function(event) {
                        if (event && event.stopPropagation) {
                            event.stopPropagation();
                        }

                       if($this.boxes.length>0)
                       {
                         $this.boxes.pop().remove();
                         $ringbox.clear($this.boxeScopes.pop(), $this.boxeDeferred.pop(), arguments);
                       }

                    }

                    $ringbox.closeAll = function() {
                       for(var i=$this.boxes.length-1;i>=0;i--) {
                          $this.boxes.pop().remove();
                          $ringbox.clear($this.boxeScopes.pop(), $this.boxeDeferred.pop(), arguments);
                       }
                    }


                    /* required for mini player*/
                    var eventTranstionEnd = function () {

                        $ringbox.minimizedBox.dom[0].style.display = 'none';
                        $player.showMiniPlayer();

                        if($this.boxes.length == 0) {
                          document.body.className = document.body.className.replace('ringbox-opened','');
                        }
                    };

                    $ringbox.removeMinimize = function() {

                       if($ringbox.minimizedBox.dom) {
                          $ringbox.minimizedBox.dom.remove();
                       }

                       if($ringbox.minimizedBox.scope) {
                         $ringbox.minimizedBox.scope.$destroy();
                       }
                       /*
                       if($ringbox.minimizedBox.deferred) {
                         $ringbox.minimizedBox.deferred.resolve.apply(null, param);
                       } */

                    }

                    $ringbox.minimize = function() {

                       if($this.boxes.length>0) {

                             $ringbox.minimizedBox.dom = $this.boxes.pop();
                             $ringbox.minimizedBox.scope = $this.boxeScopes.pop();
                             $ringbox.minimizedBox.deferred = $this.boxeDeferred.pop();

                             var boxcontainer = $ringbox.minimizedBox.dom[0].querySelector('.ringbox-content'),
                             x = (boxcontainer.offsetLeft + ((boxcontainer.offsetWidth - 335)/2) - 200),
                        	   y = window.innerHeight - (boxcontainer.offsetTop + ((boxcontainer.offsetHeight - 150)/2)) - 120,
                             transfrom = ("translate(-" + x + "px," + y + "px) scale(0.35,0.24)");

                             $ringbox.minimizedBox.dom[0].querySelector('.pv-profile').style.display = 'none'; // hide comment part

                             boxcontainer.style.webkitTransition = 'transform 0.5s';
                  					 boxcontainer.style.MozTransition = 'transform 0.5s';
                  				   boxcontainer.style.msTransition = 'transform 0.5s';
                  					 boxcontainer.style.OTransition = 'transform 0.5s';
                  					 boxcontainer.style.transition = 'transform 0.5s';

                             boxcontainer.style.webkitTransform = transfrom;
                  					 boxcontainer.style.MozTransform = transfrom;
                  				   boxcontainer.style.msTransform = transfrom;
                  					 boxcontainer.style.OTransform = transfrom;
                  					 boxcontainer.style.transform = transfrom;

        					           //boxcontainer.addEventListener('webkitTransitionEnd', eventTranstionEnd);
                             //boxcontainer.addEventListener('msTransitionEnd', eventTranstionEnd);

                  					 boxcontainer.addEventListener(prefix+'TransitionEnd', eventTranstionEnd);
                  					 boxcontainer.addEventListener('transitionend', eventTranstionEnd);


                       }
                    }

                   $ringbox.maximize = function(parent, content) {

                     if($ringbox.minimizedBox.dom) {

                         var boxcontainer = $ringbox.minimizedBox.dom[0].querySelector('.ringbox-content');
                         var boxOverlayDom = $ringbox.minimizedBox.dom[0].querySelector('div.ringbox-overlay');


                         $ringbox.minimizedBox.dom[0].querySelector('.pv-profile').style.display = 'block';
                         $ringbox.minimizedBox.dom[0].style.display = 'table';
                         parent.appendChild(content);

                         boxcontainer.style.webkitTransform = 'initial';
            					   boxcontainer.style.MozTransform = 'initial';
            				     boxcontainer.style.msTransform = 'initial';
            					   boxcontainer.style.OTransform = 'initial';
            					   boxcontainer.style.transform = 'initial';

              					 $this.boxes.push($ringbox.minimizedBox.dom);
              					 $this.boxeScopes.push($ringbox.minimizedBox.scope);
                         $this.boxeDeferred.push($ringbox.minimizedBox.deferred);
                         if($this.boxes.length == 1) {
                            document.body.className = document.body.className.trim()+' ringbox-opened';
                         }

    					           $ringbox.minimizedBox = {dom:null, scope:null, deferred:null};

    					           //boxcontainer.removeEventListener('webkitTransitionEnd', eventTranstionEnd);
                		     //boxcontainer.removeEventListener('msTransitionEnd', eventTranstionEnd);
    					           //boxcontainer.removeEventListener('transitionend', eventTranstionEnd);


            					   boxcontainer.removeEventListener(prefix+'TransitionEnd', eventTranstionEnd);
            					   boxcontainer.removeEventListener('transitionend', eventTranstionEnd);

                      }

                   }
                   /*end of player api*/

                    $ringbox.open = function (boxOptions) {

                        var boxResultDeferred = $q.defer();
                        var boxOpenedDeferred = $q.defer();
                        var boxTimer = false, uiTimer = false;

                        var boxDom = $this.init(),
                         	boxContentDom = angular.element(boxDom[0].querySelector('div.ringbox-content')),
                         	boxLoaderDom = angular.element(boxContentDom[0].querySelector('div.ringbox-loader')),
                         	boxInnerDom = angular.element(boxContentDom[0].querySelector('div.ringbox-inner')),
                          boxOverlayDom = angular.element(boxDom[0].querySelector('div.ringbox-overlay'));

                        if(typeof boxOptions.loaderHide == 'undefined') boxOptions.loaderHide = true;  

                        boxContentDom.css({'width':'200px','height':'95px','max-width':'200px','max-height':'95px'});
                        if(boxOptions.animation) {
                          boxContentDom.addClass('animation');
                        }
                        $this.adjustBoxes();
                        //merge and clean up options
                        boxOptions = angular.extend({}, boxOptions);
                        var boxScope = (boxOptions.scope || $rootScope).$new();
                        boxScope.boxIsLoading = true;
                        angular.forEach($ringboxProvider.options,function(value,key){
                            boxScope[key] = boxOptions[key];
                        });
                        if(angular.isObject(boxOptions.scopeData)){
                          angular.forEach(boxOptions.scopeData,function(value,key){
                            boxScope[key] = boxOptions.scopeData[key];
                        });
                        }
                        $this.boxeScopes.push(boxScope);
                        $this.boxeDeferred.push(boxResultDeferred);

                        var showLoader = function() {
                            boxContentDom.addClass('ringbox-invisible');
                            boxLoaderDom.css({'display':'block'});
                            boxInnerDom.css({'display':'none'});
                            boxContentDom.css({'width':'200px','height':'95px','max-width':'200px','max-height':'95px'});
                        };

                        var hideLoader = function() {

                           setTimeout(function() {
                                boxLoaderDom.css({'display':'none'});
                                boxInnerDom.css({'display':'inline-block'});
                                heightChagned();
                                boxContentDom.css({'width':'auto','height':'auto','max-width':'100%','max-height':'100%'});
                                boxContentDom.removeClass('ringbox-invisible');
                             }, 300);
                        };

                        var initUI = function() {
                            document.body.appendChild(boxDom[0]);
                            document.body.className = document.body.className.replace('ringbox-opened','');
                            document.body.className = document.body.className.trim()+' ringbox-opened';
                            uiTimer = false;
                        };


                        /*Start showing loader after 500ms*/
                        if(boxOptions.templateUrl && (boxOptions.templateUrl.indexOf('image-popup.html') || boxOptions.templateUrl.indexOf('media-popup.html'))) {
                           uiTimer = setTimeout(initUI,200);
                        }
                        else {
                          initUI();
                        }



                       // boxScope.$watch(heightChagned);


                        boxScope.$on(SystemEvents.RINGBOX.UPDATE, function($event, key){
                            heightChagned(true);
                        });

                      // var previousHeight = 0;

                       var heightChagned = function(event) {

                              if(event && boxLoaderDom.css('display') !='none') return;

                              if(boxContentDom && boxOptions.scrollable) {

                                   var boxOffsetHeight = boxInnerDom[0].offsetHeight, margin;

                                   margin = Math.max((Utils.viewport.y/2 - boxOffsetHeight/2),40);
                                   boxContentDom.css({'margin-top':margin+'px'});

                                   if(boxOffsetHeight > Utils.viewport.y ) {
                                     boxOverlayDom.css({'right':Utils.scrollbarWidth+'px'});
                                   }
                                   else {
                                     boxOverlayDom.css({'right':'0px'});
                                   }
                               }
                        };


                        //verify options
                        if (!boxOptions.template && !boxOptions.templateUrl) {
                            throw new Error('One of template or templateUrl options is required.');
                        }

                        var templateAndResolvePromise =
                            $q.all([getTemplatePromise(boxOptions)].concat(getResolvePromises(boxOptions.resolve)));

                            var boxlInstance = {
                                result: boxResultDeferred.promise,
                                opened: boxOpenedDeferred.promise,
                                close: $ringbox.close,
                                closeAll: $ringbox.closeAll,
                                showLoader: showLoader,
                                hideLoader: hideLoader,
                                adjustHeight: heightChagned
                            };


                            templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {

                             boxScope.boxIsLoading = false;
                             boxScope.$close = $ringbox.close;

                             if(!boxInnerDom) return;

                             if(boxTimer) {
                               clearTimeout(boxTimer);
                             }

                            var ctrlInstance, ctrlLocals = {};
                            var resolveIter = 1;

                            //controllers
                            if (boxOptions.controller) {
                                ctrlLocals.$scope = boxScope;
                                ctrlLocals.$boxInstance = boxlInstance;
                                for(var key in boxOptions.resolve){
                                  if(boxOptions.resolve.hasOwnProperty(key)){
                                    ctrlLocals[key] = tplAndVars[resolveIter++];
                                  }

                                }
                                // angular.forEach(boxOptions.resolve, function (value, key) {

                                // });

                                ctrlInstance = $controller(boxOptions.controller, ctrlLocals);
                                if (boxOptions.controllerAs) {
                                    boxScope[boxOptions.controllerAs] = ctrlInstance;
                                }
                            }

                             boxInnerDom.html(tplAndVars[0]);
                             $compile(boxInnerDom.contents())(boxScope);

                             if(uiTimer) {
                               clearTimeout(uiTimer);

                               if(boxOptions.loaderHide) {
                                 boxLoaderDom.css({'display':'none'});
                                 boxContentDom.removeClass('ringbox-invisible');
                               }

                               initUI();
                             }

                             boxContentDom.css({'width':'auto','height':'auto','max-width':'100%','max-height':'100%'});

                             if(boxOptions.loaderHide) {
                               hideLoader();
                             }
                             

                             boxScope.$parent.$rgDigest();

                        }, function resolveError(reason) {
                            boxResultDeferred.reject(reason);
                                $ringbox.close();
                        });

                        templateAndResolvePromise.then(function () {
                            boxOpenedDeferred.resolve(true);
                        }, function () {
                            boxOpenedDeferred.reject(false);
                        });

                        /*Attached Event*/
                        if(boxOptions.scrollable) {
                           boxDom.addClass('scrollable');
                           heightChagned();
                        }

                        if(boxOptions.onBackDropClickClose) {

                           boxOverlayDom.on('click', function overlayCloseFn(event) {
                              boxOverlayDom.off('click',overlayCloseFn);
                              $ringbox.close(event);
                           });

                           /*This hack is required only if ringbox is scrollable*/
                           if(boxOptions.scrollable) {
                           		boxDom[0].addEventListener('click', function boxClick(evt) {
                                //evt.preventDefault();
                                evt.stopPropagation();
                             		if (evt.target.className.indexOf('ringbox-outerContainer') != -1) {
                                		boxDom[0].removeEventListener('click',boxClick);
                                		$ringbox.close();
                              		}
                           		}, false);
                           }
                        }

                        if(boxOptions.onEscape) {
                           $document.bind('keyup', function boxKeyup(evt) {
                               var keyCode = evt.which || evt.keyCode || evt.key;

                               if (keyCode != 32) {
                                 evt.stopImmediatePropagation();
                               }

                               if (keyCode == 27) {

                                  /* Player status */
                                  if($player.escapeKey) {
                                    $player.escapeKey = false;
                                    return;
                                  }

                                  $document.unbind('keyup',boxKeyup);
                                  $ringbox.close();
                                }
                                return false;
                           });
                        }

                        if(boxOptions.scrollable) {
                           		boxDom.bind('scroll', function boxScroll(evt) {
                             		  if((boxDom[0].scrollHeight - (boxDom[0].offsetHeight+boxDom[0].scrollTop)) < 100) {
                             		     if(angular.isFunction(boxScope.onScroll)) boxScope.onScroll();
                             		     if(angular.isFunction(boxScope.loadMore)) boxScope.loadMore();
                             		  }
                           		});

                              //boxContentDom[0].addEventListener(prefix+'AnimationStart', heightChagned, false);
                             // boxInnerDom[0].addEventListener('DOMNodeInserted', heightChagned, false);
                         }
                        /* End of events*/

                        boxScope.$on('$destroy',function(){
                           boxDom = null;
                           boxContentDom = null;
                           boxLoaderDom = null;
                           boxInnerDom = null;
                           boxlInstance = null;
                           boxOptions = null;
                           boxOverlayDom = null;
                           templateAndResolvePromise = null;
                        });

                        boxTimer = setTimeout(function() {

                            if(boxScope && boxScope.boxIsLoading) {
                              Notification.error({message: "Something went wrong! Please try again."});
                              $ringbox.close();
                            }

                        }, 20000);

                       return boxlInstance;
                    };

                    return $ringbox;
                }]
        };

        return $ringboxProvider;
    })
    .directive('rgRingbox',['$ringbox',function($ringbox){
        return {
            restrict : 'EA',
            scope:{
                ringboxData : '&',
                scopeData : '&',
                onRingBoxOpen : '&',
                onRingBoxClose : '&',
                onScroll : '&',
                ringboxFalsyFunc : '&',
                ringboxOpen : '&'
            },
            link : function(scope,element,attr){
                var scopeOffEvent;
                function mainFunction(event) {
                    event.preventDefault();
                    //event.stopPropagation();

                    var type,target,items={}, scopeDataItems = {};

                    type = attr.ringboxType;// html,remote:require template url
                    if(!type)type='html';//innerhtmlof the provided content or a data content

                    if(attr.ringboxData){
                        if(angular.isFunction(scope.ringboxData)){
                            items = scope.ringboxData();
                        }else{
                            items = scope.ringboxData;
                        }
                    }

                    if(attr.scopeData){
                        if(angular.isFunction(scope.scopeData)){
                            scopeDataItems = scope.scopeData();
                        }else{
                            scopeDataItems = scope.scopeData;
                        }
                    }

                    var tempitems = items.data ? items.data:items;
                    var ringOb = {
                        type : type,
                        scrollable: (attr.ringboxScrollable && (attr.ringboxScrollable=="true" || attr.ringboxScrollable==true))?true :false,
                        loaderHide : (attr.loaderHide && (attr.loaderHide=="false" || attr.loaderHide==false))?false :true,
                        scope : attr.ringboxScope?scope:false,
                        scopeData : scopeDataItems || {},
                        controller: attr.ringboxController || '',
                        resolve : {
                            localData : tempitems,
                            remoteData : items.promise ? items:angular.noop
                        },
                        onBackDropClickClose : (attr.ringBackdropClose && (attr.ringBackdropClose=="false" || attr.ringBackdropClose==false))?false :true,
                        animation : (attr.ringboxAnimation && (attr.ringboxAnimation=="false" || attr.ringboxAnimation==false))?false :true,
                        onEscape : (attr.ringCloseEscape && (attr.ringCloseEscape=="false" || attr.ringCloseEscape==false))?false :true
                    };

                    if(type === 'remote'){
                        ringOb.templateUrl = attr.ringboxTarget || scope.ringboxTarget || attr.href || attr.src;
                    }else if(type === 'video') {

                    } else if (type === 'inline'){
                        ringOb.template = attr.ringboxTarget || scope.ringboxTarget;
                    } else {
                         type = 'html';
                         target = attr.ringboxTarget || scope.ringboxTarget;
                         if(!target){
                             ringOb.template = element.html();
                         }else{
                            ringOb.template = angular.element(document.querySelector(target));
                            if(ringOb.template.length > 0){
                                ringOb.template = ringOb.template[0].outerHTML;
                            } else{
                                throw new Error("Opps ! Your Provideed Target element Does Not Exist!");
                            }
                         }

                    }

                    var boxInstance = $ringbox.open(ringOb);

                    boxInstance.result.then(function (selectedItem) {
                        if(angular.isDefined(scope.onRingBoxClose) && angular.isFunction(scope.onRingBoxClose)){
                            scope.onRingBoxClose();
                        }

                    });

                    boxInstance.opened.then(function() {
                        if(angular.isDefined(scope.onRingBoxOpen) && angular.isFunction(scope.onRingBoxOpen)){
                            scope.onRingBoxOpen();
                        }
                    });

                };

                function bindEvent(fn) {
                    element.on("click",fn);
                    scopeOffEvent =  scope.$on('$destroy',function(){
                        element.off('click', fn);
                    });
                };

                function bindFalsyEvent(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if(angular.isFunction(scope.ringboxFalsyFunc)){
                        scope.ringboxFalsyFunc();
                    }
                }

                if(attr.ringboxOpen){
                    scope.$watch('ringboxOpen()', function(newValue) {
                        if(scopeOffEvent){
                          element.off("click",mainFunction);
                          element.off("click",bindFalsyEvent);
                          scopeOffEvent();
                        }
                         if(newValue){
                            bindEvent(mainFunction);
                         }else{
                            bindEvent(bindFalsyEvent);
                         }
                    });
                }else if(attr.rgRingbox === "" || attr.rgRingbox === "true" || attr.rgRingbox === true){
                  bindEvent(mainFunction);
                }else{
                  bindEvent(bindFalsyEvent);
                }
            }
        };
    }]);
