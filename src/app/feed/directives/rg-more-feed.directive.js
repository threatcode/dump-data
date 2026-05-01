/**
 * © Ipvision
 */


    angular
        .module('ringid.feed')
        .directive('rgMoreFeed', rgMoreFeed);


    rgMoreFeed.$inject = ['feedFactory', 'SystemEvents','$ringbox'];
    function rgMoreFeed(feedFactory, SystemEvents,$ringbox) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {

              var feed = scope.$eval(attr.rgMoreFeed),count=0,moreel;
              var content = feed.getDynamicText().toString(),showMoreButton=feed.showMore();


                function setFeedText(){
	                var tempContent=content;
	                if(!scope.showFeedFullContent){
	                		tempContent = feed.getCroppedHtml();
               		}
                    if(tempContent){
                        element.html(tempContent);
                        if(!scope.editorEnabled){
                            element.removeClass('ng-hide');
                        }else{
                            element.addClass("ng-hide");
                        }

                    }else{
                        element.addClass("ng-hide");
                    }
                    SetShowMoreButton();
                }



                function SetShowMoreButton(){
                    if(showMoreButton) {
                      moreel = angular.element('<span style="display:inline-block;margin-left:5px;" class="showpointer showmore"> Show More</span>');
                        element.append(moreel);
                        moreel.bind('click', moreFeedText);
                        scope.$on('$destroy',function(){
                           if(!!moreel) {
                              moreel.unbind('click');
                              moreel = null;
                           }
                        });
                    }
                }
                function initiate(){
                    content = feed.getDynamicText().toString();
                    showMoreButton = feed.showMore();
                    if(!!moreel) {
                              moreel.unbind('click');
                              moreel = null;
                           }
                    setFeedText();//skipping for first time
				}

                setFeedText();

                scope.$on(SystemEvents.FEED.UPDATED, function(event, data){
                    if( data.id === feed.getKey() ){
                       initiate();
                    }
                });

                scope.$on(SystemEvents.FEED.RESET, function(event, f){
                    if( f.getKey() === feed.getKey() ){
                        feed = f;
                        initiate();
                    }
                });

                scope.$watch('feed.text()', function(oldVal, newVal){
                   if(count > 0){
                   		   initiate();
                   }
                   count++;
                });

                scope.$watch('editorEnabled', function(oldVal, newVal){
                    //setFeedText();//skipping for first time
                });


                function moreFeedText() {
                if(feed.showMore()){

					var boxInstance = $ringbox.open({
                        type : 'remote',
                        scope:false,
                        scrollable:true,
                        controller: 'PopupSingleFeedController',
                        onBackDropClickClose : true,
                        resolve : {
                            remoteData : function(){
                              return feedFactory.moreFeedText(feed);
                            }
                        },
                        templateUrl : 'pages/home/popup-feed.html'
                    });
				} else {
				  element.html(content);
				  moreel.unbind("click");
				  moreel = null;
				}

						//feedFactory.moreFeedText(feed).then(function(json) {
                            //scope[attr.rgMoreFeed] = feed;
                            //element.html(feed.getDynamicText().toString());
                            //moreel.unbind('click');
                            //moreel=null;
                            //updatedText = true;
                            //scope.$rgDigest();
                    //});
                }



            }
        };
    }

