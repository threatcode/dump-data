

    angular
        .module('ringid.newsportal')
        .controller('portalFollowController', portalFollowController);

    portalFollowController.$inject = [ '$scope','$rootScope','remoteData','localData','rgScrollbarService','portalHttpService','SystemEvents','$ringbox' ];
    function portalFollowController( $scope,$rootScope,remoteData,localData,rgScrollbarService,portalHttpService,SystemEvents,$ringbox ) { // jshint ignore:line

    	$scope.portalName = localData.target.getFullName();
    	$scope.portalId = localData.target.getKey();

        var catList = [],followList=[],unfollowList=[],allCatListId=[],toFollowList=[],type=0;

        for(var i=0;i<remoteData.nCatList.length;i++){
        	catList.push(remoteData.nCatList[i]);
        	allCatListId.push(remoteData.nCatList[i].id);
        	if(remoteData.nCatList[i].subsc){
        		followList.push(remoteData.nCatList[i].id);
        	}
        }  

        if( remoteData.nCatList.length == followList.length ){
        	$scope.selectall = true;
        	$scope.$rgDigest();
        }

        $scope.categoryList = catList;

        if(followList.length==0){
            $scope.selectall = true;
            for(var k=0;k<$scope.categoryList.length;k++){
                $scope.categoryList[k].subsc = $scope.selectall;
            }  
            followList = allCatListId;
            $scope.$rgDigest();
        }

        $scope.selectPortalCat = function(catObj){
        	var followIndex = followList.indexOf(catObj.id);
        	var unfollowIndex = unfollowList.indexOf(catObj.id);

        	if(catObj.subsc){
        		if(unfollowIndex !== -1){
        			unfollowList.splice(unfollowIndex,1);
        		}
        		if(followIndex === -1){
        			followList.push(catObj.id);
        		}
           	}else{
           		if(followIndex !== -1){
        			followList.splice(followIndex,1);
        		}
        		if(unfollowIndex === -1){
        			unfollowList.push(catObj.id);
        		}
           	}
        }

        $scope.doneFollow = function(){
        	portalHttpService.doneFollowing($scope.portalId,followList,unfollowList,type).then(function(json){
        		if(json.sucs===true){
                    json.index = localData.index;
					$rootScope.$broadcast(SystemEvents.PORTAL.DONE_FOLLOW_PORTAL,json);
					if(followList.length===0){
						$rootScope.$broadcast(SystemEvents.PORTAL.UNFOLLOW_PORTAL,json);
					}
					$ringbox.close();
        			// $scope.$close();
        		}else{
        			$ringbox.close();
        		}
        		$scope.$rgDigest();
        	})
        };

        $scope.cancelFollow = function(){
        	$scope.$close();
        };

        $scope.selectAllCat = function(){

        	if($scope.selectall){
        		type = 2;
        		followList = allCatListId;
        		unfollowList = [];
        		$scope.$rgDigest();
        	}else{
        		type = 1;
        		followList = [];
        		unfollowList = allCatListId;
        		$scope.$rgDigest();
        	}
        	for(var j=0;j<$scope.categoryList.length;j++){
	        	$scope.categoryList[j].subsc = $scope.selectall;
	        }  
	        $scope.$rgDigest();

        }

        $scope.$on('$destroy',function(){
        	catList = [];
        })
    }

