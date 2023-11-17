/**
 * © Ipvision
 */


    angular.module('ringid.feed')
    .directive('feedRepeat', feedRepeat);

    feedRepeat.$inject = ['$parse', '$compile', '$templateCache', '$http', 'Utils','$rootScope', 'SystemEvents','$sniffer', 'feedFactory'];

    function feedRepeat($parse, $compile, $templateCache, $http, helper, $rootScope, SystemEvents, $sniffer, feedFactory) {

        function compile(element, attr) {


            return function ($scope, $element, $attr, ctrl, $transclude) {

                var expression = $attr.feedRepeat;
                var match = expression.match(/^\s*(.+)\s+in\s+(.*?)\s*$/),
                    index, lhs, rhs, trackByExp, valueIdentifier, cell, cells = [],
                    maxColumn = 3,
                    column = helper.feedColumn(),
                    lastBlockMap = Object.create(null),
                    lastCollection = [],
                    onFeedProcesing = false,
                    wrapper = document.querySelector('div.middle'),
                    feedContainer = document.getElementById('feeds-container'),
                    wh = helper.viewport.y,
                    hwh = wh/2,
                    wst = 0,
                    scrollHeight=0,
                    prefix = $sniffer.vendorPrefix.toLowerCase(),
                    doAnimation = (prefix == 'moz' || prefix == 'ms')? false: true,
                    busy = false,
                    first = true,
                    totalFeeds =0,
                    specialTpl = '',
                    specials = [],
                    readyToFeed = false,
                    lastLoader = false,
                    lastLoaderFrame = false,
                    specialBlockMap = Object.create(null),
                    postbox = false,
                    elm;

                /*
                if (!match) {
                    throw "Expected expression in form of '_item_ in _collection track by _key_'";
                } */

                var t0 = window.performance.now();

                lhs = match[1];
                rhs = match[2];

                /* find getter function by parsing track by*/
                var getTrackID = (match[3])? $parse(match[3]) : '';

                valueIdentifier = match[1];

                // Creating Feed Cell
                for (index = 0; index < maxColumn; index++) {
                    cell = {};
                    elm = document.createElement('div');
                    elm.className = "cell cell-id" + index;
                    elm.appendChild(document.createComment('cell: ' + index));
                    cell.element = elm;

                    /*loader*/
                    var loader = document.createElement('div');

                    loader.innerHTML = '<div class="rf-box">'
                                            + '<div class="rf-top">'
                                                + '<div class="rf-cir">'
                                                     + '<span class="icon-logo-circle"></span>'
                                                + '</div>'
                                                + '<div class="rf-line"></div>'
                                                + '</div>'
                                                + '<div class="rc-feed"> </div>'
                                                + '<div class="rc-feed rc2"> </div>'
                                                + '<div class="rc-feed rc3"> </div>'
                                                + '<div class="rf-ics"></div>'
                                            + '</div>';

                    loader.style.display = 'none';
                    elm.appendChild(loader);

                    cell.loader = loader;
                    cells[index] = cell;

                    /*post box*/
                    if ($scope.showPostBox() && $attr.postbox && index == 0) {
                        (function (elm) {
                            $http.get($attr.postbox, {cache: $templateCache}).then(function (result) {
                                var template = $compile(result.data)($scope);
                                //elm.firstChild appendChild(template[0]);
                                elm.insertBefore(template[0], elm.firstChild.nextSibling);
                                readyToFeed = true;

                                requestAnimationFrame(function(){
                                  update($scope[rhs]);
                               });

                               /*digest after loading postbox*/
                               $scope.$rgDigest();

                            });
                        })(elm);
                       postbox = true;
                    }else{
                        readyToFeed = true;
                        requestAnimationFrame(function(){
                           update($scope[rhs]);
                        });
                    }
                  loader = null;
                }

                if($scope.showSpecialFeed()){
                $http.get("templates/partials/special-feed.html", {cache: $templateCache}).then(function (result) {
                    specialTpl = result.data;
                 });
                }



                /* append in main div*/
                for (index = 0; index < maxColumn; index++) {
                    $element[0].appendChild(cells[index].element);
                }


                function showLoader(display,calledFrom) {

                   if(lastLoader == display || lastLoaderFrame) return;

                   requestAnimationFrame(function(){
                      for (var index = 0; index < column; index++) {
                       if(cells && cells[index].loader) cells[index].loader.style.display = (display)?'block':'none';
                      }
                      lastLoaderFrame = false;

                      //console.log('display ='+display+' time '+ window.performance.now());
                      //console.log(calledFrom);


                   });

                   lastLoaderFrame = true;
                   lastLoader = display;

                }

                function setCellVisibility() {

                    for (var index = 0; index < maxColumn; index++) {
                        if (index < column) {
                            cells[index].element.style.display = 'block';
                        }
                        else {
                            cells[index].element.style.display = 'none';
                        }
                    }
                }

                function doColumnChange(){
                    update($scope[rhs]);
                    onScrollEvent(false);
                    busy = false;
                    showLoader(busy,"line 160");
                    setCellVisibility();
                }


                /*set view window*/
                wrapper.style.height = wh+'px';
                element[0].className='cols-'+column;
                setCellVisibility();
                busy = true;
                showLoader(busy,"line 170");

                /* calculate height*/
                var offsetTop = (-1)*wh*4;
                var offsetBottom = wh*4;
                var lastHeight =0;

                /* scorilling hack for refreshing issue */

                document.documentElement.scrollTop = 0;
                document.body.parentNode.scrollTop = 0;
                document.body.scrollTop = 0;


                function onScrollEvent(loadFeed) {

                        /*request new feed*/
                        if(!readyToFeed) return;
                        if(!cells) return;

                        requestAnimationFrame(function() {

                            var loadThreshold;
                            scrollHeight = $element[0].scrollHeight;
                            loadThreshold = scrollHeight - helper.viewport.y - helper.viewport.y;


                            if (helper.viewport.yo > loadThreshold && !!loadFeed) {

                                $scope.LoadMoreData();

                                if($scope.noMoreFeed) return;

                                if($scope.busy != busy) {
                                   busy = $scope.busy;
                                   showLoader(busy,"Line 205");
                                }
                            }


                            /*hide feed dom if it is out of the viewport*/
                            if(onFeedProcesing) return;
                            if(Math.abs(helper.viewport.yo - wst) < hwh) return;

                            var cols = [139,0,0], col, trackID, value, block, height, show = [], hide = [], pt=[0,0,0], pb=[0,0,0]; 
                            wst = helper.viewport.yo;

                            if(!postbox) {
                              cols[0] = 0;  
                            }

                            /*special feeds*/

                            for (index = 0; index < specials.length; index++) {
                                value = specials[index];
                                trackID = value.key;
                                if(!specialBlockMap[trackID]) continue;

                                block = specialBlockMap[trackID];
                                if(!block) continue;
                                height = block.height;
                                col = block.cell;
                                cols[col] += height;

                                if( cols[col] >= (offsetTop + wst) &&  cols[col] <= (wst+wh+offsetBottom)) {
                                    if(!!block.clone.RG_HIDDEN) {
                                       show.push(block.clone);
                                    }
                                }
                                else {

                                    if(cols[col] < (offsetTop + wst)) {
                                        pt[col] += height;
                                    }

                                    if(cols[col] >= (offsetTop + wst) && cols[col] > (wst+wh+offsetBottom)) {
                                        pb[col] += height;
                                    }

                                    if(!block.clone.RG_HIDDEN) {

                                       hide.push(block.clone);
                                    }
                                }
                            }

                            /*regular feed*/
                            for (index = 0; index < lastCollection.length; index++) {

                                value = lastCollection[index];
                                trackID = value.key;
                                if(!lastBlockMap[trackID]) continue;
                                block = lastBlockMap[trackID];
                                if(!block) continue;
                                height = block.height;
                                col = block.cell;
                                cols[col] += height;

                                if( cols[col] >= (offsetTop + wst) &&  cols[col] <= (wst+wh+offsetBottom)) {
                                    if(!!block.clone.RG_HIDDEN) {
                                       show.push(block.clone);
                                    }
                                }
                                else {

                                    if(cols[col] < (offsetTop + wst)) {
                                        pt[col] += height;
                                    }

                                    if(cols[col] >= (offsetTop + wst) && cols[col] > (wst+wh+offsetBottom)) {
                                        pb[col] += height;
                                    }

                                    if(!block.clone.RG_HIDDEN) {

                                       hide.push(block.clone);
                                    }
                                }
                            }

                           value = null;
                           block = null;

                           var max = Math.max(Math.max.apply(null, cols),wh);

                          // requestAnimationFrame(function() {

                                wrapper.style.height = (max+hwh)+'px';
                                for (var i = 0; i < cells.length; i++) {
                                   cells[i].element.style.paddingTop = pt[i]+'px';
                                }

                                for (var i = 0; i < show.length; i++) {
                                    show[i].style.display = 'block';
                                    show[i].RG_HIDDEN = false;
                                 }

                                for (var i = 0; i < hide.length; i++) {
                                    hide[i].style.display = 'none';
                                    hide[i].RG_HIDDEN = true;
                                }
                      });

                  }

                window.addEventListener("scroll", onScrollEvent);

                $scope.$on(SystemEvents.COMMON.COLUMN_CHANGED, function(event, newVal){
                    column = newVal;
                    element[0].className='cols-'+column;
                    doColumnChange();
                });

                $scope.$on(SystemEvents.COMMON.WINDOW_RESIZED, function(event, newVal){
                    column = helper.feedColumn();
                    element[0].className='cols-'+column;
                    //doColumnChange();
                });


                $scope.$watchCollection(rhs, update);


                $scope.$on('$destroy', function(){
                   lastBlockMap = lastCollection = elm = cells = cell = specialBlockMap = specials = wrapper = feedContainer = specialTpl =lastLoader = null;
                   window.removeEventListener("scroll", onScrollEvent);
                });

                $scope.$on(SystemEvents.FEED.HEIGHT, function($event, key){

                    $event.stopPropagation();

                    if(!lastBlockMap || !lastBlockMap[key]) return;

                    deferFeedHeight(key);
                });

                $scope.$on(SystemEvents.FEED.BUSY, function($event, isBusy){
                     busy = isBusy;
                     showLoader(busy,"LINE 343");
                });


                function deferFeedHeight(key){


                    fastdom.defer(3,function() {
                        if(lastBlockMap && lastBlockMap[key]) {
                           lastBlockMap[key].height = lastBlockMap[key].clone.offsetHeight + 12;
                        }
                     });
                }

                function eventTranstionEnd() {

                  this.removeEventListener(prefix+'TransitionEnd', eventTranstionEnd);
                  this.removeEventListener('transitionend', eventTranstionEnd);
                  this.parentNode.removeChild(this);

                }


                function update(collection) {


                    var index, i, length = collection.length,
                        value, childScope, cellIndex, trackID, block, prevNode = [],
                        nextNode, nextBlockMap = Object.create(null), parent, clone,
                        special = 0, initialDigest = false; //speciaSerial = false

                     onFeedProcesing = true;

                     if(!readyToFeed) return;
                     if(!cells) return;

                     if(collection.length == 0 && first) {

                        if($scope.noMoreFeed) {

                            requestAnimationFrame(function(){
                                $scope.$rgDigest();
                                //initialDigest = false;
                            });
                        }
                        return;
                     }


                      $rootScope.$$postDigest(function() {
                         var index, value, block;
                         for (index = 0; index < collection.length; index++) {
                            value = collection[index];
                            trackID = value.key;
                            if(!lastBlockMap[trackID]) continue;
                            block = lastBlockMap[trackID];
                            if(!block) continue;
                            if(block.childHead) block.scope.$$childHead = block.childHead;
                          }
                      });


                    if(feedFactory.hasSpecialFeed()) {
                       specials = feedFactory.getSpecialFeedList();
                       special = specials.length;
                    }



                    /* Find next Blocks that are going to be added*/

                    for (index = 0; index < length; index++) {

                        cellIndex = (index+special) % column;
                        value = collection[index];
                        trackID = value.key; // huh, considering a constant track ID

                        if (lastBlockMap[trackID]) {

                            block = lastBlockMap[trackID];
                            if(!block) continue;
                            block.cell = cellIndex;
                            delete lastBlockMap[trackID]; // found it and it is going to be processed in next blockmap and deleted it

                        } else {

                            childScope = $scope.$new();
                            childScope[valueIdentifier] = value;
                            block = {};
                            block.clone = null;
                            block.cell = cellIndex;
                            block.scope = childScope;
                            block.height = 110;
                            block.key = trackID;
                            block.serial = -1;

                        }

                        //collection[index]['$TrackID'] = trackID;
                        nextBlockMap[trackID] = block;
                    }


                    /* initialise a prev node */
                    for (index = 0; index < column; index++) {
                        if (!prevNode[index]) prevNode[index] = (postbox && index == 0 && cells[index].element.firstElementChild) ? cells[index].element.firstElementChild : cells[index].element.firstChild;
                    }

                    /* Remove blocks from existing which are not going to process*/
                    for (trackID in lastBlockMap) {
                        if (lastBlockMap[trackID]) {
                            block = lastBlockMap[trackID];
                            if(!block) continue;
                            block.clone.style.opacity =0;
                            block.clone.RG_DELETE = true;


                            block.clone.addEventListener(prefix+'TransitionEnd', eventTranstionEnd);
                            block.clone.addEventListener('transitionend', eventTranstionEnd);

                            block.scope.$destroy();
                        }
                    }

                    /* Build DOM now*/
                    var defer = 2;
                    var nodesToBeAppeard =[];


                      /* Special feeds*/
                    if(specialTpl && special > 0) {

                       for (index = 0; index < special; index++) {

                           value = specials[index];
                           trackID = value.key;
                           cellIndex = index % column;

                           nextNode = prevNode[cellIndex];
                           parent = nextNode.parentNode;

                           if(specialBlockMap[trackID]) {

                                 block = specialBlockMap[trackID];
                                 if(!block) continue;
                                 clone = block.clone;
                                 block.cell = cellIndex;

                                 if (clone != nextNode.nextSibling) {
                                   parent.insertBefore(clone, nextNode.nextSibling);
                                 }

                                /*
                                 if(!block.serialElm) {
                                   block.serialElm = block.clone.querySelector('[feed-serial]');
                                 } */

                                 prevNode[block.cell] = clone;
                           }
                           else {

                               //specials[index]['$TrackID'] = trackID;
                               childScope = $scope.$new();
                               childScope[valueIdentifier] = value.value;
                               clone = $compile(specialTpl)(childScope);

                               parent.insertBefore(clone[0], nextNode.nextSibling);
                               nextNode = clone[0];

                               nextNode.style.opacity =1;

                               block = {};
                               block.clone = clone[0];
                               block.cell = cellIndex;
                               block.scope = childScope;
                               block.height = 110;
                               block.key = trackID;
                               block.serial = index;
                               block.serialElm = block.clone.querySelector('[feed-serial]');

                               prevNode[cellIndex] = nextNode;
                               specialBlockMap[trackID] = block;

                               (function(nextNode, block){
                                        fastdom.defer(1,function() {
                                           if(!block) return;
                                           block.height = nextNode.offsetHeight + 12;
                                        });
                                })(nextNode, block);
                          }

                          if(block.serialElm) {
                            block.serialElm.innerHTML = index+1;
                           // speciaSerial = true;
                          }
                       }

                    }

                    /*regular feeds*/

                    for (index = 0; index < length; index++) {

                        value = collection[index];
                        trackID = value.key;
                        block = nextBlockMap[trackID];
                        if(!block) continue;
                        block.scope.$index = index;
                        nextNode = prevNode[block.cell];
                        parent = nextNode.parentNode;
                        clone = block.clone;

                        //if(clone && clone.RG_HIDDEN) continue;

                        if (clone) {

                             // skip nodes that are already pending removal via leave animation
                            do {
                                nextNode = nextNode.nextSibling;
                            } while (nextNode && nextNode.RG_DELETE);

                            if (clone != nextNode) {
                               parent.insertBefore(clone, nextNode);
                            }

                            prevNode[block.cell] = clone;

                            block.childHead = block.scope.$$childHead;
                            block.scope.$$childHead = null;

                         }
                        else {

                             $transclude(block.scope, function (clone) {

                                parent.insertBefore(clone[0], nextNode.nextSibling);
                                nextNode = clone[0];

                                (function(nextNode, block){
                                    fastdom.defer(++defer,function() {
                                       if(!block) return;
                                       block.height = nextNode.offsetHeight + 12; // bottom margin of each 12
                                    });
                                })(nextNode, block);

                                if(!doAnimation || first || totalFeeds < 10) {
                                    nextNode.style.opacity =1;
                                }
                                else {
                                    nodesToBeAppeard.push(nextNode);
                                }

                                block.clone = nextNode;
                                prevNode[block.cell] = nextNode;
                                block.serialElm = block.clone.querySelector('[feed-serial]');
                                totalFeeds++;
                            });
                        }


                        if(block.serial != (index+special) && block.serialElm) {
                           block.serialElm.innerHTML = special+index+1;
                           block.serial = index+special;
                        }
                    }


                    if(nodesToBeAppeard.length> 0 ) {

                            fastdom.defer(2, function() {

                                if(!nodesToBeAppeard) return false;

                                for (index = 0; index < nodesToBeAppeard.length; index++) {
                                    nodesToBeAppeard[index].style.opacity =1;
                                }
                                nodesToBeAppeard = null;
                            });
                     }


                    if($scope.busy != busy) {
                       busy = $scope.busy;
                       showLoader(busy,"Line 639");
                       busy = null;
                    }


                    /* Updating last blockmap from current block map*/
                    lastBlockMap = nextBlockMap;
                    lastCollection = collection;
                    onFeedProcesing = false;

                    /* release ref*/
                    nextBlockMap =  null;
                    first = false;
                    block = null;
                    clone = null;
                    parent = null;
                    nextNode = null;
                    prevNode = null;
                    childScope = null;

                    if(collection.length <= 10) {
                       //initialDigest = true;
                       requestAnimationFrame(function(){
                          $scope.$rgDigest();
                          //initialDigest = false;
                       });
                    }

                }
            }
        }

        return {
            restrict: 'A',
            transclude: true,
            priority: 1000,
            terminal: true,
            compile: compile
        };

    }

