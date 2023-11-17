/*
 * © Ipvision
 */

angular
    .module('ringid.directives')
    .directive('scrollTop', scrollTop);

    function scrollTop () {

        function getElementYPos(elmId) {

            var elm = document.getElementById(elmId);
            var y = elm.offsetTop;
            var node = elm;

            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            }

            return y;
         }


        function link (scope, element, attrs) {


            window.onscroll = function () {
    		   if (pageYOffset >= 500) {
        			document.getElementById('back-top').style.opacity = 1;
   				} else {
 				    document.getElementById('back-top').style.opacity = 0;
               }
            }

            element.bind('click', function(event) {

            	event.preventDefault();
            	event.stopPropagation();

            	var offset = attrs.offset || 0;
            	var startY =  self.pageYOffset || document.body.scrollTop ||  document.documentElement.scrollTop || 0;
           		var stopY = getElementYPos(attrs.scrollTop)-parseInt(offset);

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

                	for ( var i=startY; i<stopY; i+=step ) {
                		setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                		leapY += step;
                		if (leapY > stopY) leapY = stopY;
                    	timer++;
            		}

             	   return;

           		}

           		for ( var i=startY; i>stopY; i-=step ) {

              		setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
              		leapY -= step;
              		if (leapY < stopY)  leapY = stopY;
              		timer++;

           		}
           });
        }

        return {
          restrict: 'A',
          link: link
        }
    }
