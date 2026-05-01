/*
 * © Ipvision
 */


angular
    .module('ringid.global_directives')
    .provider('$scrollbar', ScrollbarProvider)
    .directive('rgScrollbar', rgScrollbar)
    .factory('rgScrollbarService', rgScrollbarService);

    function ScrollbarProvider() {

          this.findPos = function (el) {
              var x = 0, y = 0;
              if (el.offsetParent) {
                  do {
                      x += el.offsetLeft;
                      y += el.offsetTop;
                  } while (el = el.offsetParent);
              }
              return {x: x, y: y};
          };

          this.findPosType = function (el) {
              var isFixed = 0, comStyle;

              if (el=el.offsetParent) {
                  do {
                      
                      comStyle = getComputedStyle(el, null);
                      if(comStyle.getPropertyValue('position') == 'fixed') {
                         isFixed = 1;
                         break;
                      }

                  } while (el = el.offsetParent);
              }
              return isFixed;
          };
          this.tabindex = 100;

          this.$get = ['$$q', function ($q) {

                  var $this = this;

                  function Scrollbar(element, option) {

                       var _self = this, animScrollStart, animScrollChange, animThumbStart, 
                            animThumbChange, animCurrentTime, animDuration = 500, mouseY, barTopForMD;

                       var option = { 
                              scrollbarWidth: option.scrollbarWidth ? option.scrollbarWidth : 8,
                              scrollbarAlways: option.scrollbarAlways ? option.scrollbarAlways : false,
                              dragSpeedModifier: option.dragSpeedModifier ? option.dragSpeedModifier : 5,
                              minThumbHeight: option.minThumbHeight ? option.minThumbHeight : 10,
                              clickSpeedModifier : option.clickSpeedModifier ? option.clickSpeedModifier : 40,
                              keyboardSpeedModifier : option.keyboardSpeedModifier ? option.keyboardSpeedModifier : 20,
                              keyboardEvent: option.keyboardEvent ? option.keyboardEvent : false,
                              onBottomReached: option.onBottomReached ? option.onBottomReached : false
                       }; 

                       this.scrollbarMousedown = false;
                       this.isFreezed = false;
                       this.freezeInfo = {height:'',position:'', scrollHeight: 0}; 
                       this.scrollbarVisible = false;
                       this.displayState = 'none';
                       this.hasScroll = false;
                       this.lastY = 0;
                       this.scrollHeight = 0;
                       this.offsetHeight = 0;
                       this.visibleHeight = 0;
                       this.thumbHeight = 0;
                       this.thumbTimer = null;
                       this.mousewheel = (typeof InstallTrigger !== 'undefined')?'DOMMouseScroll':'mousewheel';
                       this.isTouchSupport = 'ontouchstart' in window || navigator.msMaxTouchPoints;
                       this.isFixedPosition = -1;

                       this.dom = Object.create(null);
                       this.dom.element = element;
                       this.dom.scrollbarContainer = this.dom.element.parentNode;
                       this.dom.wrapper = document.createElement('div');
                       this.dom.scrollbar = document.createElement('div');
                       this.dom.scrollbarThumb = document.createElement('div');

                       this.dom.scrollbar.className = 'scrollbar';
                       this.dom.scrollbarThumb.className = 'thumb';
                       this.dom.wrapper.className = 'ringscroll';
                       this.dom.element.style.overflow = 'hidden';
                       this.dom.wrapper.setAttribute('style', 'position:relative;width:auto;overflow:hidden;height:100%;');
                       this.dom.scrollbar.setAttribute('style', 'height:100%;right:1px;opacity:0;top:0px;position:absolute;z-index:1;width:'+option.scrollbarWidth+'px');
                       this.dom.scrollbarThumb.setAttribute('style', 'right:1px;top:0px;opacity:0;position:absolute;z-index:1;width:'+option.scrollbarWidth+'px');

                       //this.dom.wrapper.appendChild(this.dom.element);
                       //this.dom.wrapper.appendChild(this.dom.scrollbar);
                       //this.dom.wrapper.appendChild(this.dom.scrollbarThumb);
                       //this.dom.scrollbarContainer.appendChild(this.dom.wrapper);

                       this.dom.scrollbarContainer.insertBefore(this.dom.wrapper, this.dom.element);
                       this.dom.wrapper.appendChild(this.dom.element);
                       this.dom.wrapper.appendChild(this.dom.scrollbar);
                       this.dom.wrapper.appendChild(this.dom.scrollbarThumb);

                       /*
                          pos is mandatory
                          animation and currenThumbPos is optional
                       */

                       this.scroll = function(pos, animation, currentThumbPos) {

                              var ratio;

                              fastdom.read(function() {

                                      if(!_self.dom.element) return;

                                      _self.hiddenHeight = _self.scrollHeight - _self.offsetHeight;
                                      _self.visibleHeight = _self.offsetHeight - _self.thumbHeight;
                                      
                                      ratio = pos/_self.visibleHeight;
                                      pos= Math.min(Math.max(pos, 0), _self.visibleHeight);

                                      if(animation) {
                                          
                                          animCurrentTime = 0;

                                          animScrollStart = _self.dom.element.scrollTop;
                                          animScrollChange = (( _self.hiddenHeight * ratio ) - animScrollStart );

                                          animThumbStart =  currentThumbPos;
                                          animThumbChange = pos - animThumbStart;

                                          _self.doAnimation();
                                      }
                                      else {
                                        
                                          fastdom.write(function(){
                                            _self.dom.element.scrollTop = _self.hiddenHeight * ratio;
                                            _self.dom.scrollbarThumb.style.top = pos+'px';
                                          });

                                      }

                                       /*call bottom reach*/
                                      if(pos==_self.visibleHeight && option.onBottomReached && angular.isFunction(option.onBottomReached)) {
                                         option.onBottomReached();
                                      }
                               });
                         }

                         this.reCalculate = function(promise) {

                                 var ratio, pos, defer = (promise) ? $q.defer() : false;

                                 fastdom.read(function() {

                                        if(!_self.dom) return;

                                        if(_self.isFreezed) {
                                            _self.dom.wrapper.style.height = '100%';
                                            _self.dom.element.style.position = _self.freezeInfo.position;
                                            _self.dom.element.style.height =  _self.freezeInfo.height;  
                                            _self.dom.element.style.bottom = 'initial';
                                        }

                                        _self.scrollHeight = _self.dom.element.scrollHeight;
                                        _self.offsetHeight = _self.dom.element.offsetHeight;

                                        _self.hiddenHeight = _self.scrollHeight - _self.offsetHeight;
                                        _self.thumbHeight = Math.max(( _self.offsetHeight/_self.scrollHeight ) * _self.offsetHeight, option.minThumbHeight );
                                        
                                        if(isNaN(_self.thumbHeight) || _self.thumbHeight=='Infinity') _self.thumbHeight = 0;

                                        _self.visibleHeight = _self.offsetHeight - _self.thumbHeight;

                                        if(_self.isFreezed) {
                                            _self.dom.element.scrollTop = (_self.scrollHeight - _self.freezeInfo.scrollHeight);
                                         }

                                        ratio = _self.visibleHeight/_self.hiddenHeight;
                                        pos = _self.dom.element.scrollTop * ratio;

                                        _self.displayState = (_self.thumbHeight>=_self.offsetHeight) ? 'none' : 'block';
                                        _self.hasScroll = (_self.thumbHeight>=_self.offsetHeight) ? false : true;

                                        fastdom.write(function() {

                                              if(_self.dom) {
                                                  _self.dom.scrollbar.style.display = _self.displayState;
                                                  _self.dom.scrollbarThumb.style.height = _self.thumbHeight + 'px';
                                                  _self.dom.scrollbarThumb.style.display = _self.displayState;
                                                  _self.dom.scrollbarThumb.style.top = pos+'px';
                                              }

                                             if(defer) {
                                                defer.resolve();
                                             } 
                                             _self.isFreezed = false; 
                                        });
                                });
                                
                               return (defer) ? defer.promise : false;
                           };

                           /*
                             scroll by any valid css selector.
                             inlcusive - true/false , if true, it will consider element height as well
                             offset - any extra value that need to be added/subsctructed
                           */

                           this.scrollBySelector = function(selector, inclusive, offset) {
                                
                                var elementHeight = 0, element = null, newPos = 0, offsetHeight,
                                    barTop = 0, offsetTop, containerHeight = 0, scrollTop, ratio = 0;

                                offset = (typeof offset !== 'undefined') && (offset !== null) ? parseInt(offset) : 0;

                                element = this.dom.element.querySelector(selector);

                                if(element) {

                                    offsetTop = element.offsetTop;
                                    offsetHeight = element.offsetHeight;

                                    barTop = parseFloat(_self.dom.scrollbarThumb.style.top);
                                    
                                    if(inclusive) elementHeight = offsetHeight;

                                    if(( barTop + this.dom.element.scrollTop ) < offsetTop) {
                                       containerHeight = ( this.dom.element.offsetHeight - offsetHeight );
                                       if(inclusive) elementHeight = -1 * offsetHeight;
                                    } 

                                    scrollTop = offsetTop + elementHeight + offset - containerHeight;
                                    ratio = scrollTop / this.hiddenHeight;

                                    newPos =  (ratio * this.visibleHeight);  
                                    this.scroll(newPos,true,barTop);   
                                }

                            };

                            this.freeze = function () {

                                if(!this.hasScroll) return;

                                var bottom = this.scrollHeight - (this.dom.element.scrollTop + this.offsetHeight);

                                if(this.freezeInfo.height == '') {
                                   var comStyle = getComputedStyle(this.dom.element, null);
                                   this.freezeInfo.height = comStyle.getPropertyValue('height');
                                   this.freezeInfo.position = comStyle.getPropertyValue('position');
                                }

                                this.freezeInfo.scrollHeight = this.scrollHeight;

                                this.dom.wrapper.style.height = this.offsetHeight+'px';
                                this.dom.element.style.position = 'absolute';
                                this.dom.element.style.bottom = '-'+bottom+'px';
                                this.dom.element.style.height =  'auto';
                                this.isFreezed = true;
                            };

                            this.scrollByPos = function (position, animation) {
                              
                              var newPos, barTop;
                              animation = (typeof animation !== 'undefined') && (animation !== null) ? animation : false;

                              if(animation) {
                                barTop = parseFloat(this.dom.scrollbarThumb.style.top);
                              }

                              position = parseInt(position);
                              newPos =  (position * this.visibleHeight) / 100;
                              this.scroll(newPos,animation,barTop);     
                            };

                            this.scrollTop = function(animation) {
                              this.scrollByPos(0,animation);
                            };

                            this.scrollBottom = function(animation) {
                              this.scrollByPos(100,animation);
                            };

                        
                           this.hideScrollbar = function() {

                              if(option.scrollbarAlways || _self.isFreezed) return ;

                              if(!_self.scrollbarMousedown) {
                                     _self.dom.scrollbar.style.opacity = 0;
                                     _self.dom.scrollbarThumb.style.opacity = 0;
                                     _self.scrollbarVisible = false;
                              }

                              _self.thumbTimer = null;   
                           };

                           this.showScrollbar = function() {

                              if(!this.isFreezed) {
                                _self.reCalculate(); 
                              }
                              
                              _self.dom.scrollbar.style.opacity = 1;
                              _self.dom.scrollbarThumb.style.opacity = 1;
                              _self.scrollbarVisible = true;

                              if(option.keyboardEvent) {
                                 _self.dom.element.focus();
                              }
                           };

                           this.destroy = function(){

                             this.dom.scrollbarContainer.removeEventListener('mouseenter', mouseenterCallback);
                             this.dom.scrollbarContainer.removeEventListener('mouseleave', mouseleaveCallback);
                             this.dom.scrollbarThumb.removeEventListener('mousedown', mousedownCallback);
                             this.dom.scrollbar.removeEventListener('click', clickCallback);
                             this.dom.element.removeEventListener(this.mousewheel, mousewheelCallback);
                             this.dom.element.removeEventListener('keydown', keydownCallback); 
                             this.dom.element.removeEventListener('touchmove', touchmoveCallback);

                              /*clear DOM reference*/
                              _self = this.dom = null;
                           };

                          this.doAnimation = function() {

                                  animCurrentTime += 25;

                                  var scrollAmount = Math.easeIn(animCurrentTime, animScrollStart, animScrollChange, animDuration);
                                  var topAmount = Math.easeIn(animCurrentTime, animThumbStart, animThumbChange, animDuration);

                                  _self.dom.element.scrollTop = scrollAmount;
                                  _self.dom.scrollbarThumb.style.top = topAmount+'px';

                                  if (animCurrentTime < animDuration) {
                                       requestAnimationFrame(_self.doAnimation);
                                  }
                           }


                           this.dom.scrollbarContainer.addEventListener('mouseenter', mouseenterCallback,false);
                           this.dom.scrollbarContainer.addEventListener('mouseleave', mouseleaveCallback,false);
                           this.dom.scrollbarThumb.addEventListener('mousedown', mousedownCallback,false);
                           this.dom.scrollbar.addEventListener('click', clickCallback,false);
                           this.dom.element.addEventListener(this.mousewheel, mousewheelCallback,false);

                           if(option.keyboardEvent) {
                             this.dom.element.addEventListener('keydown', keydownCallback); 
                             this.dom.element.setAttribute('tabindex',$this.tabindex++);
                           }
                           
                           if(this.isTouchSupport) {
                              this.dom.element.addEventListener('touchmove', touchmoveCallback);
                           }

                          /*DOM event listener*/
                           function keydownCallback(e) {
                              e.preventDefault();
                              e.stopPropagation();
                              var keyCode = e.which || e.keyCode || e.key;

                              if(keyCode == 38 || keyCode == 40) {

                                  _self.showScrollbar();
                                  
                                  var barTop = parseFloat(_self.dom.scrollbarThumb.style.top);
                                  var modifier = option.keyboardSpeedModifier;
                                  if(keyCode ==38) modifier = modifier * -1;
                                  var newPos = barTop + modifier;
                                  _self.scroll(newPos); 

                                  if(_self.thumbTimer) {
                                    clearTimeout(_self.thumbTimer);   
                                  }

                                  _self.thumbTimer = setTimeout(_self.hideScrollbar,1000);       
                              }
                           }

                           function clickCallback(e) {

                                  e.preventDefault();
                                  var pos = $this.findPos(_self.dom.scrollbar), diff,
                                      barTop = parseFloat(_self.dom.scrollbarThumb.style.top),
                                      modifier, newPos;

                                  if(_self.isFixedPosition == -1 ) {
                                    _self.isFixedPosition = $this.findPosType(_self.dom.element);
                                  }    

                                  diff = (_self.isFixedPosition ? e.clientY : e.pageY) - pos.y;    
                                  modifier = option.clickSpeedModifier + parseInt((_self.scrollHeight / _self.offsetHeight) / 20) * option.clickSpeedModifier; 
                                  if(diff < barTop) modifier = modifier * -1;
                                  newPos = barTop + modifier;
                                  _self.scroll(newPos,true,barTop); 
                            }

                             function mousewheelCallback(e) {

                                    if(_self.displayState=='none') return;
                                    e.preventDefault();
                                    if(!_self.scrollbarVisible) _self.showScrollbar();

                                    var barTop = parseFloat(_self.dom.scrollbarThumb.style.top), delta, modifier, newPos;

                                    delta = (e.wheelDelta)? - 1/40 * e.wheelDelta : e.detail*3;
                                    modifier = Math.max(parseInt((_self.offsetHeight*2 / _self.scrollHeight) * option.dragSpeedModifier),1);
                                    newPos = barTop + (delta * modifier);
                                    _self.scroll(newPos);
                            }

                            function mousedownCallback(e) {

                                    e.preventDefault();
                                    e.stopPropagation();

                                    if(!_self.scrollbarVisible) _self.showScrollbar();
                                    _self.scrollbarMousedown = true;
                                    mouseY= e.pageY;
                                    barTopForMD = parseFloat(_self.dom.scrollbarThumb.style.top);

                                    document.addEventListener('mousemove', docMousemoveCallback, false);
                                    document.addEventListener('mouseup', docMouseupCallback, false);
                            }

                            function docMousemoveCallback(e) {
                                 var newPos = barTopForMD+e.pageY-mouseY;
                                 _self.scroll(newPos);
                            }

                            function docMouseupCallback(e) {
                                 e.stopPropagation();
                                _self.scrollbarMousedown = false;
                                document.removeEventListener('mousemove',docMousemoveCallback);
                                document.removeEventListener('mouseup',docMouseupCallback);
                            }

                            function touchmoveCallback(e) {
                                    e.preventDefault();
                                    var delta = 2, newPos, modifier,
                                        currentY = e.touches[0].clientY,
                                        barTop = parseFloat(_self.dom.scrollbarThumb.style.top);
                                  
                                    modifier = Math.max(parseInt((_self.offsetHeight*2 / _self.scrollHeight) * option.dragSpeedModifier),1);
                                    newPos = (currentY < _self.lasty)  ? barTop + (delta * modifier) : barTop - (delta * modifier);
                                    
                                    _self.scroll(newPos);
                                    _self.lasty = currentY;
                            }

                            function mouseleaveCallback() {
                               _self.hideScrollbar();    
                            }

                            function mouseenterCallback() {
                               _self.showScrollbar();    
                            }
                    }

                    var $scrollbarProvider = {};
                    $scrollbarProvider.create = function (element, option) {
                        var scrollbar = new Scrollbar(element, option);
                        return scrollbar;
                    }

                   return $scrollbarProvider;

          }]; 
    } 
    
    rgScrollbar.$inject = ['$scrollbar'];

    function rgScrollbar($scrollbar) {

          function linkFunc(scope, element, attr) {

                    if(attr.disabled == "true" || attr.disabled ==true) {
                            return;
                    }

                    var option = {};

                    if(attr.thumbHeight && parseInt(attr.thumbHeight) > 0) {
                       option.minThumbHeight =  parseInt(attr.thumbHeight);
                    }

                    if(attr.keyboard) {
                       option.keyboardEvent =  true;
                    }

                    if(scope.bottomReached) {
                      option.onBottomReached = scope.bottomReached;
                    }

                    var scrollbar = $scrollbar.create(element[0],option);

                   /* Scope event listner */
                   scope.$on('scrollTop', function(event) {
                       
                       if (event.stopPropagation) {
                              event.stopPropagation();
                       }

                       setTimeout(function() {
                           scrollbar.scroll(0);
                       }, 100);
                   });

                    /* 
                     position could be numeric value or string
                     Numeric example  10, 50, 100  (will be considered 10%, 50% and 100% respectively)
                     String example, any CSS selector e.g .last-row, #my-row-id
                    */

                   scope.$on('scrollTo', function(event, position, inclusive, offset) { 

                          if (event.stopPropagation) {
                               event.stopPropagation();
                          }

                          if(typeof position == 'string') {
                              scrollbar.scrollBySelector(position, inclusive, offset);
                          }
                          else {
                              scrollbar.scrollByPos(position);
                          }
                   });

                   scope.$on('recalculate', function(event) {

                          if (event.stopPropagation) {
                              event.stopPropagation();
                          }
                           scrollbar.reCalculate();
                   });

                   scope.$on('hasScroll', function(event, $scope) {

                          if (event.stopPropagation) {
                              event.stopPropagation();
                          }
                          $scope.scroll = (scrollbar.hasScroll)?false:true;
                   });

                   scope.$on('freeze', function(event, $scope) {

                          if (event.stopPropagation) {
                              event.stopPropagation();
                          }
                          scrollbar.freeze();
                   });

                   scope.$on("$destroy", function(){
                       scrollbar.destroy();
                       scrollbar = null;
                   });

                 /*End of scope events listners*/  
          }

          return {
                  restrict: 'A',
                  scope: {
                      bottomReached: '&'
                  },
                  link: linkFunc
          };

     }

    /*perf: bypass broadcast, think different*/
    function rgScrollbarService() {
         
         return {
                    scrollTop: function(scope) {
                            scope.$broadcast('scrollTop');
                    },
                    scrollTo: function(scope,position, inclusive, offset) {
                            scope.$broadcast('scrollTo',position, inclusive, offset);
                    },
                    recalculate: function(scope) {
                            scope.$broadcast('recalculate');
                    },
                    hasScroll: function(scope) {
                         scope.$broadcast('hasScroll', scope);
                    }
          };
    }
