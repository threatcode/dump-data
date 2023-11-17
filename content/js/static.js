if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}
function addListener(element, event, fn) {
	if(!element) return;
    // Use addEventListener if available
    if (element.addEventListener) {
      element.addEventListener(event, fn, false);

    // Otherwise use attachEvent, set this and event
    } else if (element.attachEvent) {
      element.attachEvent('on' + event, (function (el) {
        return function() {
          fn.call(el, window.event);
        };
      }(element)));

      // Break closure and primary circular reference to element
      element = null;
    }
  };
(function(window) {

	var scrollInit = false;
	function initScrollAction() {
	
	    var setting = {fixedHeaderOffset:55, fixedHeaderSelector:'.header', fixedHeaderClass:'headerscroll', backBtnSelector:'#back-top', backBtnOffset: 500};
		var pageYOffset =  self.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop || 0;
	    
		if(document.querySelector(setting.backBtnSelector)) {
			if (pageYOffset >= setting.backBtnOffset) {
				document.querySelector(setting.backBtnSelector).style.opacity = 1;
			} else {
				document.querySelector(setting.backBtnSelector).style.opacity = 0;
			}
	    }		
		
		var header = document.querySelector(setting.fixedHeaderSelector);
		if(header) {
	    	if (pageYOffset >= setting.fixedHeaderOffset) {
			   header.className += header.className.indexOf(setting.fixedHeaderClass) <0 ? ' '+setting.fixedHeaderClass:'';
			} else {
			   header.className = header.className.replace(setting.fixedHeaderClass,'').trim();
			}
	    }		
	   
	   /*scroll top init if failed due to ng-view*/
	   if(!scrollInit && document.querySelector('.scrolltop')) {
	      scrollInit = true;
	      scrollTo({
		    selector: '.scrolltop'
	      });
	   }
	   
	}



	function scrollTo(option) {

		var i, elem;
		var setting = option || {selector:'.scrolltop'};
		if (!setting.selector) return false;

		var elements = document.querySelectorAll(setting.selector);
		
		for (i = 0; i < elements.length; i++) {
			elem = elements[i];
            scrollInit = true;
			if (elem.getAttribute('href')) {
             
				addListener(elem, 'click', function(e) {

					e.preventDefault ? e.preventDefault() : e.returnValue = false;
					e.stopPropagation ? e.stopPropagation() : e.returnValue = false;
					
					var offset = this.getAttribute('offset') || 0;
					var startY = self.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop || 0;
					var stopY = getElementYPos(this.getAttribute('href')) - parseInt(offset);

					var distance = stopY > startY ? stopY - startY : startY - stopY;

					if (distance < 100) {
						scrollTo(0, stopY);
						return;
					}

					var speed = Math.round(distance / 100);
					if (speed >= 20) speed = 20;

					var step = Math.round(distance / 25);
					var leapY = stopY > startY ? startY + step : startY - step;
					var timer = 0;

					if (stopY > startY) {

						for (var i = startY; i < stopY; i += step) {
							setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
							leapY += step;
							if (leapY > stopY) leapY = stopY;
							timer++;
						}

						return;

					}

					for (var i = startY; i > stopY; i -= step) {

						setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
						leapY -= step;
						if (leapY < stopY) leapY = stopY;
						timer++;

					}

				});

			}
		}


		function getElementYPos(elmId) {
			
			elmId=elmId.replace('#', '');
			if(!elmId) return 0; 
			var elm = document.getElementById(elmId);
			var y = elm.offsetTop;
			var node = elm;

			while (node.offsetParent && node.offsetParent != document.body) {
				node = node.offsetParent;
				y += node.offsetTop;
			}

			return y;
		}
	}

	
	function Accordion(element, option) {
            
            var setting = option || { itemSelector:'.item', descSelector:'.desc', titleSelector:'.title' };
            
            var i, items, titles, descs, self = this;
            
            this.current = 0;
            this.data = [];
           
            items = element.querySelectorAll(setting.itemSelector);
            titles = element.querySelectorAll(setting.titleSelector);
            descs = element.querySelectorAll(setting.descSelector);

              
            this.showItem = function(e) {
            
                  var i;
                  self.current = this.myPos;
                  for (i = 0; i < items.length; i++) {
                      items[i].className = items[i].className.replace('active','').trim();
                  }
                  items[self.current].className += ' active';
                  
                  for (i = 0; i < descs.length; i++) {
                      descs[i].style.height = '0px';
                   }
                  descs[self.current].style.height = self.data[self.current]+'px';
            }
            
            for (i = 0; i < descs.length; i++) {
                  this.data[i] = descs[i].clientHeight;
                  descs[i].style.height = '0px';
            }
          
            for (i = 0; i < titles.length; i++) {
                 titles[i].myPos = i;
                 addListener(titles[i], 'click', this.showItem);
            }
     }
     
   function accordionInit(selector, option) {
      
      var accordions = document.querySelectorAll(selector);
      for(var i= 0; i < accordions.length; i++) {
         new Accordion(accordions[i], option);
      }
         
   }


   function Slider(option) {
	   

            var nextSlide = 0,
                autoSlide = true,
                sliderTimer = null,
				crsl_items_array = [],
                i;
                
            var setting = option || {selector:'.slider', slideSelector:'.slide', navSelector:'.nav li', descSelector:'.desc', carouselSelector:'.nav-carousel',delay:5};
		
            var slider_dom = document.querySelector(setting.selector);
            if( !slider_dom ) return ;
            
            var delay = parseInt(setting.delay) * 1000 || 3000;

            var slides = slider_dom.querySelectorAll(setting.slideSelector);
            var desc = slider_dom.querySelectorAll(setting.descSelector) || {};
            var navs = slider_dom.querySelectorAll(setting.navSelector) || {};
            
            /* vars for carousel*/
            var crsl_distance = 120;
            var crsl_distance_multiplier = 0.6;
            var crsl_size_multiplier = 0.6;
            var crsl_opacity_multiplier = 0.8;
             
            var crsl = slider_dom.querySelector(setting.carouselSelector);
            var crsl_items = crsl.querySelectorAll('img');
            //crsl_items = Array.prototype.slice.call(crsl_items);
			
			for(i=0;i<crsl_items.length;i++) {
			  crsl_items_array[i] = crsl_items[i];	
			}
			crsl_items = crsl_items_array;
            var crsl_data = []; 
            var crls_width = crsl.clientWidth;
            var crls_height = crsl.clientHeight;
            var center = Math.floor(crsl_items.length/2);
            /* end of carousel*/

            setupEvent();
            playSlide();

            function playSlide() {
              
                for (i = 0; i < slides.length; i++) {
                   slides[i].className = slides[i].className.replace('active','').trim();
                }
                slides[nextSlide].className += ' active';
                
                
                for (i = 0; i < desc.length; i++) {
                   desc[i].className = desc[i].className.replace('active','').trim();
                }
                desc[nextSlide].className += ' active';
                
                for (i = 0; i < navs.length; i++) {
                   navs[i].className = navs[i].className.replace('active','').trim();
                }
                navs[nextSlide].className += ' active';
                
                
                /* Move carousel*/
                if(crsl_data[0]) {
                    playCarousel(findMappedItem(nextSlide));
                }
                

                if (autoSlide) {
                    nextSlide = (nextSlide + 1 == slides.length) ? 0 : nextSlide + 1;
                    setTimer();
                }

            }

            function setTimer() {

                sliderTimer = setTimeout(function () {
                    playSlide();
                }, delay);
            }

            function clearTimer() {
                clearTimeout(sliderTimer);
            }

            function index(node) {

                var children = node.parentNode.childNodes;
                var num = 0;
                for (var i = 0; i < children.length; i++) {

                    if (children[i] == node) return num;
                    if (children[i].nodeType == 1) num++;

                }
                return -1;
            }

            function setupEvent() {
                
                for (i = 0; i < navs.length; i++) {

                    addListener(navs[i], 'click', function (e) {
                        nextSlide = index(this);
                        clearTimer();
                        playSlide();
                    });
					
					 
					
                }
                
                
                for (i = 0; i < slides.length; i++) {
                    
                  addListener(slides[i], 'mouseenter', function (e) {
                       e.stopPropagation ? e.stopPropagation() : e.returnValue = false;
                       autoSlide = false;
                       clearTimer();
                   });
                   
                   addListener(slides[i], 'mouseleave', function (e) {
                        e.stopPropagation ? e.stopPropagation() : e.returnValue = false;
                        autoSlide = true;
                        setTimer();
                   });
                }
                
                for (i = 0; i < desc.length; i++) {
                    
                  addListener(desc[i], 'mouseenter', function (e) {
                       e.stopPropagation ? e.stopPropagation() : e.returnValue = false;
                       autoSlide = false;
                       clearTimer();
                   });
                   
                   addListener(desc[i],'mouseleave', function (e) {
                       e.stopPropagation ? e.stopPropagation() : e.returnValue = false;
                        autoSlide = true;
                        setTimer();
                   });
                }
                
            }
            
             /*function for carousel*/
            function initCarousel() {
            
                var item_w, item_h, item_opacity, item_left, item_top, depth, separation;
            	
            	/*for centered item*/
            	item_w= crsl_items[0].clientWidth;
            	item_h= crsl_items[0].clientHeight;
            	item_opacity= 1;
            	item_left = Math.round(crls_width/2)-Math.round(item_w/2);
            
            	item_top = Math.round(crls_height/2)-Math.round(item_h/2);
            	crsl_data[center]={
                 	'w':item_w,
                 	'h':item_h,
                 	'o':item_opacity,
                 	'l':item_left,
                 	't':item_top,
                 	'z':center,
                 	'i':0
                 };
          
                /* calculate position for right items*/
            	separation = crsl_distance; 
            	depth = center;
            	for(i=center+1;i<crsl_items.length;i++) {
               
               		separation = separation*crsl_distance_multiplier;
              		item_w =	crsl_size_multiplier * crsl_data[i-1].w;  
               		item_h =	crsl_size_multiplier * crsl_data[i-1].h;  
               		item_opacity = crsl_opacity_multiplier * crsl_data[i-1].o;  
               		item_left = crsl_data[i-1].l+crsl_data[i-1].w+separation-item_w;
                	--depth;
                	item_top = Math.round(crls_height/2)-Math.round(item_h/2);
                
                	crsl_data[i]={
                 		'w':item_w,
                 		'h':item_h,
                 		'o':item_opacity,
                 		'l':item_left,
                 		't':item_top,
                 		'z':depth,
                 		'i':i
                 	};
                }
              
              /* calculate position for left items*/
               separation = crsl_distance; 
               depth = center;
               for(i=center-1;i>=0;i--) {
               
               		separation = separation*crsl_distance_multiplier;
               		item_w =	crsl_size_multiplier * crsl_data[i+1].w;  
               		item_h =	crsl_size_multiplier * crsl_data[i+1].h;  
               		item_opacity = crsl_opacity_multiplier * crsl_data[i+1].o;  
               		item_left = crsl_data[i+1].l-separation;
                	--depth;
                	item_top = Math.round(crls_height/2)-Math.round(item_h/2);
                
                	crsl_data[i]={
                 		'w':item_w,
                 		'h':item_h,
                 		'o':item_opacity,
                 		'l':item_left,
                 		't':item_top,
                 		'z':depth,
                 		'i':i
                 	};
               }
            
            
             /* set initial position and enable event*/
              for(i=0;i<crsl_items.length;i++) {
            
                  crsl_items[i].orgPos = i;
                  crsl_items[i].crslPos = i;
                  addListener(crsl_items[i], 'click', function (e) {
                     if (this.crslPos==center) return ; 
                     
                     nextSlide = this.orgPos;
                     clearTimer();
                     playSlide();
                     playCarousel(this);
                     
                     
                  });
               }
               
           } 
           
           function playCarousel(item) {
             moveItem(item);  
             setItemPosition(); 
           }

           function moveItem (item) {
              
                   var temp, direction = item.crslPos < center ? 'forward' : 'backward';
                   
                   while (item.crslPos != center) {
                        if( direction == 'forward') {
                        	temp = crsl_items.pop();
                        	crsl_items.unshift(temp);
                        } else {
                            temp = crsl_items.shift();
                            crsl_items.push(temp);
                        }
                          
                        //update position
                        for(i=0;i<crsl_items.length;i++) {
                            crsl_items[i].crslPos = i; 
                            crsl_items[i].className = '';
                        }
                   }
                 item.className= 'active';  
           }
            
         
         function setItemPosition() {
         
             	for(i=0;i<crsl_items.length;i++) {   
                	crsl_items[i].style.width =  crsl_data[i].w+'px';
                	crsl_items[i].style.height =  crsl_data[i].h+'px';
                	crsl_items[i].style.opacity =  crsl_data[i].o;
                	crsl_items[i].style.left =  crsl_data[i].l+'px';
                	crsl_items[i].style.top =  crsl_data[i].t+'px';
                	crsl_items[i].style.zIndex =  crsl_data[i].z;
                	crsl_data[i].i = i;
               } 
             
          }
          
         function findMappedItem(position) {
            
            for(i=0;i<crsl_items.length;i++) { 
               if(position ==crsl_items[i].orgPos ) {
                  return crsl_items[i];
               }
            }    
         }
         
         crsl_items[0].src = crsl_items[0].src; // loading cache issue 
         addListener(crsl_items[0], 'load', function() {
              initCarousel(); 
              playCarousel(crsl_items[0]); 
              
              setTimeout(function(){
               crsl.style.visibility =  'visible'; 
              }, 800);
            
         });
         
         /* End of carousel*/
            
	}  

    addListener(window, 'scroll', initScrollAction);
	scrollTo({
		selector: '.scrolltop'
	});
	
	accordionInit('.accordion', {
	  itemSelector: '.accordionItem',
	  descSelector: '.description',
	  titleSelector: '.title'
	});

	Slider({
	  selector: '#slider',
	  slideSelector: '.slide',
	  navSelector: '.arrowstop li',
	  descSelector: '.desc',
	  delay: 5,
	  carouselSelector:'.nav-carousel'
	});
	
   /* login button handler*/
   var browserNotice = document.getElementById('incompatible-notice');
    
   addListener(document.getElementById('login-request'), 'click', function(e) {
   		e.preventDefault ? e.preventDefault() : e.returnValue = false;
   		browserNotice.style.display = 'table';	
   });

   addListener( document.getElementById('close-btn'), 'click', function(e) {
   		e.preventDefault ? e.preventDefault() : e.returnValue = false;
   		browserNotice.style.display = 'none';	
   });

})(window);

