;
(function(window) {

	var scrollInit = false;
	function initScrollAction() {
	
	    var setting = {fixedHeaderOffset:55, fixedHeaderSelector:'.header', fixedHeaderClass:'headerscroll', backBtnSelector:'#back-top', backBtnOffset: 500};
	    
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
             
				elem.addEventListener('click', function(e) {

					e.preventDefault();
					e.stopPropagation();
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
                 titles[i].addEventListener('click', this.showItem);
            }
     }
     
   function accordionInit(selector, option) {
      
      var accordions = document.querySelectorAll(selector);
      for(var i= 0; i < accordions.length; i++) {
         new Accordion(accordions[i], option);
      }
         
   }  

    window.addEventListener('scroll', initScrollAction);
	scrollTo({
		selector: '.scrolltop'
	});
	
	accordionInit('.accordion', {
	  itemSelector: '.accordionItem',
	  descSelector: '.description',
	  titleSelector: '.title'
	});
	


})(window);