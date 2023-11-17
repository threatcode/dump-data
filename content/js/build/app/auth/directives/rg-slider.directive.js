/*
 * © Ipvision
 */

      angular.module('ringid.auth')
       .directive('rgSlider', function () {
            return {

                link: function (scope, element, atrr) {

                    var nextSlide = 0,
                        autoSlide = false,
                        sliderTimer = null,
                        navs = [],
                        i;


                    var slider_dom = element[0];

                    var nav_selector = atrr.navClass || '';
                    var slide_selector = atrr.slideClass || '';
                    var desc_selector = atrr.descClass || '';
                    var delay = parseInt(atrr.delay) * 1000 || 3000;

                    var slides = angular.element(slider_dom.querySelectorAll('.' + slide_selector));
                    var desc = angular.element(slider_dom.querySelectorAll('.' + desc_selector));
                    var nav_dom = slider_dom.querySelectorAll('.' + nav_selector) || {};

                    /* vars for carousel*/
                    var crsl_distance = 120;
                    var crsl_distance_multiplier = 0.6;
                    var crsl_size_multiplier = 0.6;
                    var crsl_opacity_multiplier = 0.8;

                    var crsl = slider_dom.querySelector('.nav-carousel');
                    var crsl_items = crsl.querySelectorAll('img');
                    crsl_items = Array.prototype.slice.call(crsl_items);
                    var crsl_data = [];
                    var crls_width = crsl.clientWidth;
                    var crls_height = crsl.clientHeight;
                    var center = Math.floor(crsl_items.length/2);
                    /* end of carousel*/

                    setupEvent();
                    playSlide();

                    function playSlide() {

                        slides.removeClass('active');
                        slides.eq(nextSlide).addClass('active');

                        desc.removeClass('active');
                        desc.eq(nextSlide).addClass('active');

                        for (i = 0; i < navs.length; i++) {
                            navs[i].find('li').removeClass('active');
                            navs[i].find('li').eq(nextSlide).addClass('active');
                        }

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
                        var nav;
                        for (i = 0; i < nav_dom.length; i++) {

                            nav = angular.element(nav_dom[i]);
                            navs.push(nav);
                            nav.find('li').on('click', function (e) {
                                nextSlide = index(this);
                                clearTimer();
                                playSlide();
                            });
                        }

                        slides.on('mouseenter', function (e) {
                            e.stopPropagation();
                            autoSlide = false;
                            clearTimer();
                        });

                        slides.on('mouseleave', function (e) {
                            e.stopPropagation();
                            autoSlide = false;
                            setTimer();
                        });

                        desc.on('mouseenter', function (e) {
                            e.stopPropagation();
                            autoSlide = false;
                            clearTimer();
                        });

                        desc.on('mouseleave', function (e) {
                            e.stopPropagation();
                            autoSlide = false;
                            setTimer();
                        });

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
                          crsl_items[i].addEventListener('click', function (e) {
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

                       //console.log(crsl_items);
                  }

                 function findMappedItem(position) {

                    for(i=0;i<crsl_items.length;i++) {
                       if(position ==crsl_items[i].orgPos ) {
                          return crsl_items[i];
                       }
                    }
                 }

                 crsl_items[0].src = crsl_items[0].src; // loading cache issue
                 crsl_items[0].addEventListener('load', function() {
                    initCarousel();
                    playCarousel(crsl_items[0]);

                    setTimeout(function(){
                       crsl.style.visibility =  'visible';
                      }, 800);
                 });

                 /* End of carousel*/

                }
            }
        });
