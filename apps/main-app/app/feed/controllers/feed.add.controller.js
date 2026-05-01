
    angular.module('ringid.feed')
    .controller("FeedAddController",['fileUploadService', '$rootScope','$scope','feedFactory','$timeout','$routeParams','SystemEvents','OPERATION_TYPES', 'rgDropdownService','PrivacySet','MESSAGES','settings',
        function(fileUploadService, $rootScope,$scope,feedFactory,$timeout,$routeParams,SystemEvents,OPERATION_TYPES, rgDropdownService,PrivacySet,MESSAGES,settings){



            // privacy and privacy dropdowns
            //var privacyCode = 2;
            $scope.privacySet = PrivacySet;
            if($scope.forAdd=='circle' || $scope.forAdd === 'friend'){
                $scope.showPrivacy = false;
            }else{
                $scope.showPrivacy = true;
                $scope.privacy = PrivacySet.PVC3;
            }

            $scope.setPrivacy = function(actionObj) {
                //actionObj.event.preventDefault();
              //  privacyCode = actionObj.privacy;
                $scope.privacy = PrivacySet['PVC'+actionObj.privacy];
                rgDropdownService.close(actionObj.event);
                $scope.$rgDigest();
            };
            //$scope.privacyHtml = 'templates/dropdowns/privacy-dropdown.html';
            $scope.privacyTemplate =
                    '<div class="ng-cloak action  ab-drop postbox-action">'+
                        '<div class="a-box" ><a rg-click="ddAction()({event: $event, privacy:ddControl.PVC1.value})" href="#"><span class="{{::ddControl.PVC1.icon}} ab-delete"></span> {{::ddControl.PVC1.text}}</a></div>' +
                        '<div class="a-box"><a rg-click="ddAction()({event: $event, privacy:ddControl.PVC2.value})" href="#"><span class="{{::ddControl.PVC2.icon}} ab-delete"></span> {{::ddControl.PVC2.text}} </a></div>' +
                        '<div class="a-box"><a rg-click="ddAction()({event: $event, privacy:ddControl.PVC3.value})" href="#"><span class="{{::ddControl.PVC3.icon}} ab-delete"></span> {{::ddControl.PVC3.text}}</a></div>' +
                    '</div>' ;


            $scope.feedText = "";
            $scope.feedLocation = {};
            $scope.ogData = {};

            $scope.filterOnProgress = false;
            $scope.ogDataLoading = false;
            $scope.ogShowPreview = false;

            // $scope.uploadEnabled = !$scope.ogData || !$scope.ogData.url ;

            $scope.inputDisabled = false;

            $scope.getValidityValues = function(){
                return new Array(30);
            };

            $scope.showTimeout = false;
            $scope.validity = -1;
            var gdata = {vldt : $scope.validity};

            if($scope.forAdd === 'friend'){
                gdata.friend = $routeParams.uId;

            }else if($scope.forAdd === 'circle'){
                gdata.group = $routeParams.circleId;
                //data.isCircle = true;
            }
            $scope.$on(SystemEvents.FILE_UPLOAD.QUEUE_START,function(){
                $scope.inputDisabled = true;
                $scope.$rgDigest();
            });

            $scope.$on(SystemEvents.FILE_UPLOAD.QUEUE_COMPLETE,function(){
                $scope.inputDisabled = false;
                $scope.$rgDigest();
            });

            $scope.shouldDisableInput = function(){
                return ( $scope.inputDisabled || $scope.ogDataLoading || $scope.filterOnProgress);
            };

            $scope.shouldDisableLocation = function(){
                	return false;
                //return ( fileUploadService.imageFiles.length > 0
                        //|| fileUploadService.videoFiles.length > 0
                        //|| fileUploadService.audioFiles.length > 0 || !!$scope.ogData.url )
            }

            $scope.shouldDisableLink = function(){
                return ( fileUploadService.imageFiles.length > 0
                        || fileUploadService.videoFiles.length > 0
                        || fileUploadService.audioFiles.length > 0 || !!$scope.feedLocation.lat )
            }

            $scope.shouldDisableMedia = function(){
                return !!$scope.ogData.url || !!$scope.feedLocation.lat;
            }

            var lastAddStatusTime = new Date().getTime(),now,i;


            $scope.addFeed = function(){

                var data = {vldt : $scope.validity};
                //var feedItemCount = 0;

                $scope.inputDisabled = true;
                data = angular.extend({},gdata,{
                    //fpvc: $scope.privacy.value,//privacyCode,
                    text: $scope.feedText,
                    vldt : $scope.validity,
                    images: fileUploadService.imageFiles,
                    videos: fileUploadService.videoFiles,
                    audios: fileUploadService.audioFiles
                });

                if($scope.privacy){
                    data.fpvc = $scope.privacy.value;
                }

                //if(data.images.length > 0) {
                //    feedItemCount++; // only images can be posted
                //}
                //if(data.videos.length > 0) {
                //    feedItemCount++; // only videos can be posted
                //}

                if(!!$scope.feedLocation.description){
                    data.lctn = $scope.feedLocation.description;
                    data.lat = $scope.feedLocation.lat;
                    data.lng = $scope.feedLocation.lng;
                }

                if(!!$scope.ogData.url){
                    data.lnkDmn = $scope.ogData.lnkDmn || $scope.ogData.url || '';
                    data.lnkDsc = $scope.ogData.description || '';
                    data.lnkTtl = $scope.ogData.title || '';
                    data.lnkURL = $scope.ogData.url || '';
                    data.lnlImgURL = $scope.ogData.image || '';

                }

                if($scope.emotions.length){
                    data.mdIds = [$scope.emotions[0].id];// we will support one emotion at a time for now
                    $scope.emotions.length = 0;//emptying emotion
                }


                if($scope.tagList.length){
                    data.tFrndIds = [];
                    for(i=0;i<$scope.tagList.length;i++){
                        data.tFrndIds.push($scope.tagList[i].getUtId());
                    }
                    $scope.tagList.length = 0;
                }

                var originalFeedText = $scope.feedText;
                //http://192.168.1.117/ringID/ringIDWeb/issues/472
                if( data.text != '' && !!data.lnkURL ) {

                    var dataTextProtocolStriped = data.text.replace('https', '').replace('http', '');
                    var feedLinkUrlProtocolStriped = data.lnkURL.replace('https', '').replace('http', '');

                    if (dataTextProtocolStriped[dataTextProtocolStriped.length - 1] == '/') {
                        dataTextProtocolStriped = dataTextProtocolStriped.slice(0, -1);
                    }

                    if (feedLinkUrlProtocolStriped[feedLinkUrlProtocolStriped.length - 1] == '/') {
                        feedLinkUrlProtocolStriped = feedLinkUrlProtocolStriped.slice(0, -1);
                    }

                    if (dataTextProtocolStriped == feedLinkUrlProtocolStriped) {
                        data.text = '';
                    }

                }



                function canPostEmptyStatus(){
                    return !!data.lnkURL
                        || data.images.length > 0
                        || data.videos.length > 0
                        || data.audios.length > 0
                        || (!!data.mdIds && data.mdIds.length > 0)
                        || (!!data.lctn)
                        || (!!data.tFrndIds && data.tFrndIds.length > 0);
                }
                function validateAddFeed(){
                		var r_value = true;$scope.errorMessage="";
                  if(data.text !== ""){
						var calculatedLength,actualLength = data.text.length,
						    utf8Length = data.text.getUTF8Length(); 
					if(utf8Length > settings.FEED_TEXT_LIMIT){
						calculatedLength = Math.floor((actualLength * settings.FEED_TEXT_LIMIT)/utf8Length);
						$scope.errorMessage = MESSAGES.FTL_ERROR.supplant({length:actualLength,max_limit:calculatedLength});
						r_value = false;
					}
				   }else if(!canPostEmptyStatus()){
				   		r_value = false;
				   		$scope.errorMessage = MESSAGES.FEED_INV;
				   }
				   

				   return r_value;

				}

                function addFeedRequest(){
                    lastAddStatusTime = now;
				     RingLogger.print(data.text,"FEED_TEXT");
				     RingLogger.print(data.text.length,"FEED_TEXT");
				     RingLogger.print(data.text.getUTF8Length(),"FEED_TEXT");
                    feedFactory.addFeed(data,$scope.currentUser).then(function(json){

                       $scope.setFeed(json);
                        //$scope.$broadcast('cleareditor');
                        $scope.$parent.$rgDigest();
                    },function(){

                       $scope.setFeed();
                       $scope.feedText = originalFeedText;
                       $scope.$broadcast('seteditor',originalFeedText);
                       $scope.$parent.$rgDigest();
                    },function(state){ // on progress notify call

                    });

                    fileUploadService.imageFiles.length = 0;
                    fileUploadService.imageFiles= [];
                    fileUploadService.videoFiles.length = 0;
                    fileUploadService.videoFiles= [];
                    fileUploadService.audioFiles.length = 0;
                    fileUploadService.audioFiles= [];

                    $scope.feedText = "";
                    $scope.validity = -1;
                    $scope.feedLocation = {};
                    $scope.ogData = {};
                    $scope.ogShowPreview = false;
                    $scope.inputDisabled = false;
                    $scope.errorMessage = "";
                    $scope.setFeed();
                    $scope.$broadcast('cleareditor');
                    $scope.$parent.$rgDigest();
                }

                if(!validateAddFeed()){
                    $scope.inputDisabled = false;
                    $scope.ogShowPreview = false;
                    $scope.$rgDigest();
                    //if (data.images.length === 0) {
                        //$rootScope.$broadcast('cleareditor',{sucs:false});
                   // }
                }else{
                     now = Date.now();
                    if(now - lastAddStatusTime < 200){
                        setTimeout(addFeedRequest,200)
                    }else{
                        addFeedRequest();
                    }

                }

            };

            $scope.selectOptions = [];
            $scope.selectOptions[0] = {
                value : -1,
                title : 'Unlimited'
            };
            for(i=1;i<=30;i++){
                $scope.selectOptions[i] = {
                    value : i,
                    title : i + " Day"
                };
            }

            $scope.selectedTimeout = function(item){
                $scope.validity = item;
                $scope.$rgDigest();
            };
            $scope.selectedLocation = function(location){
                //$scope.$apply(function(){
                    $scope.feedLocation = location;
                //});
                $scope.$rgDigest();
            };

            $scope.resetFeedLocation = function(){
                $scope.feedLocation = {};
                $scope.$rgDigest();
            };

           // $scope.showEmotion = false;
            $scope.emotions = [];
            $scope.tagList = [];

            $scope.addTag = function(item){
                var index = $scope.tagList.indexOf(item);
                if(index === -1){
                    $scope.tagList.push(item);
                }
                $scope.$rgDigest();

            };

            $scope.removeTag = function(usr){
                    var index = $scope.tagList.indexOf(usr);
                    if(index >=0){
                        $scope.tagList.splice(index, 1);
                    }
                    $scope.$rgDigest();
            };

            $scope.chooseEmotion = function(subCat){
                $scope.emotions.length = 0;//note : now we only support one media at a limt
                $scope.emotions.push(subCat);
                $scope.$rgDigest();
            };

            var pageVal = feedFactory.getCurrentPageValue();

            $scope.showAddTag  = pageVal.action !== OPERATION_TYPES.SYSTEM.TYPE_GROUP_NEWS_FEED;



        }]);
