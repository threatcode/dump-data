

    angular.module('ringid.feed')
    .directive('rgFeedSubscriber',rgFeedSubscriber);

    rgFeedSubscriber.$inject = ['$$connector','feedFactory','$window','$$rgsyncher','OPERATION_TYPES','REASON_CODES', '$rootScope'];
        function rgFeedSubscriber($$connector, feedFactory,$window,$$rgsyncher,OPERATION_TYPES,REASON_CODES, $rootScope) {
            return function (cscope, element, attrs) {
                var scope = cscope.$parent,
                    initial_req = true,
                    counter_previous =0,
                    counter_current = 0,
                    OTYPES = OPERATION_TYPES.SYSTEM,
                    timeout_set = false;

                var updateScope = function RecursePro() {
                     //counter_previous = counter_current;
                    // console.log("called UpdateScope");
                    timeout_set = true;
                    var scrollTop = 0;
                    counter_previous = counter_current;
                    window.setTimeout(function () {
                      //  console.log("called timeouts");
                        if (counter_previous !== counter_current){
                             RecursePro(); return;
                        }else{
                            timeout_set = false;
                          //  counter_current = 0;
                            scope.feeds = feedFactory.getFeeds();
                            //scrollTop = element[0].scrollTop;
                            scope.clearRequestTimer && scope.clearRequestTimer();
                            scope.busy = false;
                            scope.$rgDigest();
                            //element[0].scrollTop = (scrollTop+element[0].clientHeight-150);
                        }
                    },30);
                };
                var ignored = false;
                function processFeed(message){
                    var targetScope;
                    if(!ignored){
                        ignored = true;
                        scope.addIgnore();

                        setTimeout(function(){
                            $rootScope.$broadcast('FIRST_FEED_RECEIVED');
                        }, 1000);

                    }
                    if(!message.sucs && message.rc > 0 && message.rc == REASON_CODES.NO_MORE_FEED){
                        scope.setNoMoreFeed(true);
                    }else if(message.rc === 1111){
                        if(!scope.feeds.length){
                            feedFactory.initFeedRequest(scope.params);
                         }
                    }else{
                       targetScope = feedFactory.process(message);
                    }


                    //  console.dir(message);
                    //$timeout(function () {
                    //    feeds = feedFactory.getFeeds();
                    //    $scope.busy = false;
                    //});



                    if(targetScope){
                        targetScope.$rgDigest();
                    }else /*if (counter_current > 5 || (initial_req && counter_current>2))*/ {
                       counter_current++;
                       scope.feeds = feedFactory.getFeeds();
                       if(scope.busy){
                        scope.busy = false;
                        scope.clearRequestTimer() ;
                       }

                       //
                       //counter_current = 0;
                       //initial_req = false;
                      // if(counter_current > 10 && timeout_set === false){
                        //updateScope();
                      // }else{
                       // if(!timeout_set){

                        if(timeout_set === false) {
                            timeout_set = true;
                            requestAnimationFrame(function(){
                                scope.$rgDigest();
                                timeout_set = false;
                            });

                        }


                       // }

                      // }
                    }

                };

                var subKey = $$connector.subscribe(processFeed,{
                    filter : feedFactory.getFeedFilter(),
                    callWithUnresolved : true
                });

                // scope.$on('feedShared',function($ev){
                //     // scope.$digest();
                // });

                //$$connector.request({
                //    "actn" : OTYPES.TYPE_NEWS_FEED,
                //    "request_type" : OTYPES.REQUEST_TYPE.REQUEST,
                //    "lmt" : 10
                //}).then(function(json){
                //    console.dir(json);
                //});


               // feedFactory.requestForFeed(scope.params);


                var syncher_key = $$rgsyncher.add(function(){
                    feedFactory.requestForFeed(scope.params,1);
                });

                scope.$on('$destroy', function (){
                    $$connector.unsubscribe(subKey);
                    feedFactory.reset();
                    $$rgsyncher.remove(syncher_key);
                    if(ignored){
                        scope.removeIgnore();
                    }
                });
            };
        };
