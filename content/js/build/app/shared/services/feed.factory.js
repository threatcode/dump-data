    //var feedApp;

    //try {
        //feedApp = angular.module('ringid.feed');
    //} catch (e) {
        //feedApp =
        angular
            .module('ringid.shared')
            //[
                //'ngWebSocket','ringid.puller','ringid.utils','ringid.config', 'ringid.notification'
            //]);
    //}


        .factory('feedFactory', feedFactory);

    feedFactory.$inject = [ 'fileUploadService', '$$connector', '$$q','$$stackedMap','$$feedMap','Utils','OPERATION_TYPES', 'APP_CONSTANTS', 'Ringalert','Auth','MIN_TIMESTAMP', '$rootScope', 'SystemEvents'];
    function feedFactory( fileUploadService, $$connector, $q,$$stackedMap,$$feedMap,Utils,OPERATION_TYPES, APP_CONSTANTS, Ringalert,Auth,MIN_TIMESTAMP, $rootScope, SystemEvents) {
        var NO_MORE_FEED = false, OTYPES = OPERATION_TYPES.SYSTEM, AC = APP_CONSTANTS;
        //$feed = $$stackedMap.createNew($$feedMap.getSortIndex());

        var feed_index = OTYPES.TYPE_NEWS_FEED + '.all';
        var pvtId = 0;
        // note : do not need anymore
        //var possibleActions = [OTYPES.TYPE_NEWS_FEED,
        //    OTYPES.TYPE_GROUP_NEWS_FEED,
        //    OTYPES.TYPE_MY_NEWS_FEED,
        //    OTYPES.TYPE_FRIEND_NEWSFEED,
        //    OTYPES.TYPE_SINGLE_STATUS_NOTIFICATION_OR_SHARE_DETAILS
        //];
        var latestFeeds = [];
        var feedList = {},
            incomingFeedData = [],
            pushInIncomingFeed = false,//to keep incoming feed data in json format for later process
            ignoreActions = []; // its have key,action,callback. callback should return true or false
                               // if it returns true it will not go further execution with that action for feed

        var processorFunctions = {};
        var FEED_SCOPES = {};

        processorFunctions[OTYPES.TYPE_NEWS_FEED] = pushFeed;
        processorFunctions[OTYPES.TYPE_MY_NEWS_FEED] = pushFeed;
        processorFunctions[OTYPES.TYPE_FRIEND_NEWSFEED] = pushFeed;
        processorFunctions[OTYPES.TYPE_GROUP_NEWS_FEED] = pushFeed;
        processorFunctions[OTYPES.TYPE_MEDIAS_NEWS_FEED] = pushFeed;
        processorFunctions[OTYPES.TYPE_NEWS_PORTAL_FEED] = pushFeed;
        processorFunctions[OTYPES.TYPE_BUSINESS_PAGE_FEED] = pushFeed;
        //processorFunctions[OTYPES.TYPE_COMMENTS_FOR_STATUS] = pushComments;
        //processorFunctions[OTYPES.TYPE_LIKES_FOR_STATUS] = updateWhoLike;
        //processorFunctions[OTYPES.TYPE_LIST_LIKES_OF_COMMENT] = updateWhoLike;

        // updates todo : complete the list of updates
        processorFunctions[OTYPES.TYPE_UPDATE_ADD_STATUS] = updateAddStatus;
        processorFunctions[OTYPES.ACTION_UPDATE_SHARE_STATUS] = updateShareStatus;
        processorFunctions[OTYPES.TYPE_UPDATE_DELETE_STATUS] = updateDeleteStatus;
        processorFunctions[OTYPES.TYPE_UPDATE_EDIT_STATUS] = processUpdates;
        processorFunctions[OTYPES.TYPE_UPDATE_LIKE_STATUS] = processUpdates;
        processorFunctions[OTYPES.TYPE_UPDATE_UNLIKE_STATUS] = processUpdates;
        processorFunctions[OTYPES.TYPE_UPDATE_ADD_STATUS_COMMENT] = processUpdates;
        //processorFunctions[OTYPES.TYPE_UPDATE_LIKE_COMMENT] = processUpdates;
      //  processorFunctions[OTYPES.TYPE_UPDATE_UNLIKE_COMMENT] = processUpdates;
        processorFunctions[OTYPES.TYPE_UPDATE_DELETE_STATUS_COMMENT] = processUpdates;
       // processorFunctions[OTYPES.TYPE_UPDATE_EDIT_STATUS_COMMENT] = processUpdates;



        return {
            init: init,
            addScope : function(nfId,$scope){
                FEED_SCOPES[nfId] = $scope;
            },
            removeScope : function(nfId){
                if(FEED_SCOPES[nfId]){
                    delete FEED_SCOPES[nfId];
                }
            },
            getFeed: getFeed,

            updateTime: updateTime,

            pushFeed : pushFeed,
            processIncomingFeed : processIncomingFeed,
            setpushInIncomingFeed :function(val){
                pushInIncomingFeed = !!val;
            },
            getPushIncomingFeed : function(){
                return pushInIncomingFeed;
            },
            hasUnprocessedFeed : function(){
                return incomingFeedData.length;
            },
            addIgnoreFilter: addIgnoreFilter,

            removeIgnoreFilter: removeIgnoreFilter,

            setFactoryKey: setFactoryKey,

            createFeed : createFeed,

            process: process,

            getFeedFilter: getFeedFilter,

            noMoreFeed: noMoreFeed,

            requestForFeed: requestForFeed,
            initFeedRequest : initFeedRequest,

            getSingleFeed: getSingleFeed,

            requestForMoreFeed: requestForMoreFeed,
            getRawFeeds: getRawFeeds,

            getFeeds: getFeeds,

            addFeed: addFeed,

            shareFeed: shareFeed,

           // likeUnlikeFeed: likeUnlikeFeed,

          //  fetchComments: fetchComments,

          //  fetchCommentsByOffset: fetchCommentsByOffset,

         //   fetchCommentById: fetchCommentById,

         //   addComment: addComment,

         //   likeUnlikeComment: likeUnlikeComment,

            deleteFeed: deleteFeedService,

            saveFeed: saveFeedService,

            updateFeed: updateFeed,

          //  deleteComment: deleteComment,

           // updateComment: updateComment,

           // fetchWhoLikesFeed: fetchWhoLikesFeed,

            reset: reset,

            moreFeedText: moreFeedText,

            getSingleFeedPageKey: getSingleFeedPageKey,

            getWhoShareFeedId : getWhoShareFeedId,
            getTagUsers : getTagUsers,
            setSortBy : setSortBy,
            getCurrentPageValue : getCurrentPageValue,
            hasSpecialFeed : function(){
                var pageValue = getCurrentPageValue();
                return (OTYPES.TYPE_NEWS_FEED === pageValue.action) && (feedList.special && feedList.special.length() > 0);
            },
            getSpecialFeedList : function(){
                return feedList.special && feedList.special.all();
            },
            synchLike : synchLike,
            synchComment : synchComment
            /**
             * @description : this function is for fake feed generation for testing purpose
             * @params : startingOffset,length
             *
             */
            //fakeFeed : fakeFeedGenerator

        };


        /////////////////////////////

        // ------------------------- Private -----------------------------------
        function setSortBy(key){
            $$feedMap.setSortKey(key);
        }
        function getIndexedFeed() {

            return feedList.hasOwnProperty(feed_index) ? feedList[feed_index].data : $$stackedMap.createNew();
        }

        function getIndexedRemovedFeed(){
            return feedList.hasOwnProperty(feed_index) ? feedList[feed_index].removed : $$stackedMap.createNew();
        }
        function getCurrentPageValue(){ // returns current Feed Page Action
            var keyParts = [];
            try {
                keyParts = feed_index.split('.', 3);
            } catch (e) {
                return false;
            }

            if (keyParts.length < 2) {
                return false;
            }

            return {
                    action : parseInt(keyParts[0]),
                    page : keyParts[1],
                    ptype : keyParts[2]
                   };
        }


        function updateTime() {
            var feeds = getIndexedFeed();
            for(var i=0; i<feeds.length();i++){
                var timediff = Date.now()-feeds.all()[i].value.getTimestamp();
                if(timediff < 3600000) {
                    feeds.all()[i].value.updateTime();
                }
            }
        }
        //setInterval(feedFactory.updateTime, 180000);
        function init(ob) {

            var $feed = getIndexedFeed();

            if ($feed.length() < 10) {
                requestForFeed(ob);

                return true;// return for scope set busy //
            } else {

                return false; //return for scope set busy false cause no ajax call initiated
            }
            // initiating stack for holding feeds
        }
        function reset() {
            getIndexedFeed().reset();
            getIndexedRemovedFeed().reset();
            incomingFeedData.length = 0;
        }
        function getMinTm(){
            var sortIndex = $$feedMap.getSortIndex(),$feed = getIndexedFeed();
            if(sortIndex === 'tm'){
                return $feed.length() ? $feed.top().getTimestamp() : MIN_TIMESTAMP;
            }
            var mintimestamp = $feed.length() ? $feed.top().getAtTime() : MIN_TIMESTAMP;

            // $feed.doForAll(function(f){
            //     if(f.getTimestamp() < mintimestamp){
            //         mintimestamp = f.getTimestamp();
            //     }
            // });
            return mintimestamp;
        }
        function createFeed(json,user){
            return $$feedMap.create(json,user);
        }
        function DashboardFeedFilter(){
            return true;//all Kinda of feed will be shown
        }
        function singlePageFilter(message,pageValue){
            return message.nfId == pageValue.page || ( message.whShrLst && message.whShrLst[0].nfId == pageValue.page);
        }
        function GroupNewsFeedFilter(message,pageValue){
            return !!message.grpId && message.grpId == pageValue.page;
        }
        function MediaNewsFeedFilter(message,pageValue,action){
            return pageValue.action === action;
        }
        function NewsPortalFeedFilter(message,pageValue,action){
            return pageValue.action === action;
        }
        function CurrentUserPageFilter(tempData,pageValue){

            if(!pageValue){
                pageValue = getCurrentPageValue();
            }
            if((pageValue.page === tempData.uId) || (!!tempData.fndId && pageValue.page === tempData.fndId)){
                return true;
            }
            if(!!tempData.orgFd && ( pageValue.page === tempData.orgFd.uId)){
                return true;
            }
            return false;
        }
        function newsPortalProfileFilter(tempData,pageValue){

            if(!pageValue){
                pageValue = getCurrentPageValue();
            }
            if((pageValue.page === tempData.uId) || (!!tempData.fndId && pageValue.page === tempData.fndId)){
                return true;
            }
            return false;
        }
        function processCurrentUserFriendFeed(feedData){
            processCurrentUserFeed(feedData);
        }

        function processCurrentUserFeed(feedData){
            processAllFeed(feedData,CurrentUserPageFilter,{
                processWhoShare : function(tempData,$feed,pageValue){
                    var _d1,_d;
                    if(tempData.uId === pageValue.page && tempData.orgFd){ // someone shares it but main owner is the current user

                        _d = createFeed(tempData.orgFd);
                        _d1 = createFeed(tempData);
                        _d1.shares(_d);
                        $feed.save(_d1.getMapKey(), _d1);
                        //saveOrginalFeedIntoRemoved(_d1,tempData.nfId); profile pages doesn't need to process the update share
                    }
                }
            });
        }

        function processPortalProfileFeed(feedData){
            processAllFeed(feedData,newsPortalProfileFilter)
        }

        function processGroupNewsFeed(feedData){
            processAllFeed(feedData,GroupNewsFeedFilter);
        }
        function processMediasNewsFeed(feedData){
            processAllFeed(feedData,MediaNewsFeedFilter);
        }
        function processNewsPortalFeed(feedData){
            processAllFeed(feedData,NewsPortalFeedFilter);
        }
        function processDashboardFeed(feedData){
            processAllFeed(feedData,DashboardFeedFilter);
        }
        function processSpecialFeed(json) {
            var _d;
            if(!feedList.special){
                feedList.special = $$stackedMap.createNew($$feedMap.getSortIndex(), 'desc');
            }
            _d = createFeed(json);
            feedList.special.save(_d.getMapKey(), _d);
        };

        function processAllFeed(feedData,filterFunc,options){
            options = options || {};
            if(!angular.isFunction(filterFunc))filterFunc = function(){return true;};
            var message = angular.isArray(feedData) ? feedData : feedData.newsFeedList;
            if(!angular.isArray(message))return;
            var pageValue = getCurrentPageValue();
            var $feed = getIndexedFeed(),_d,tempKey,_d1,tempData;
            var newsfeedid;
            for (var i = 0; i < message.length; i++) {
                tempData = message[i];
                newsfeedid = tempData.nfId;
                if(pvtId==0){
                    pvtId = newsfeedid;
                }else{
                    if(newsfeedid < pvtId){
                        pvtId = newsfeedid;
                    }
                }
                // todo: should write the correct fc
                if(tempData.fc ==1){processSpecialFeed(message[i]);continue;}
                if(!filterFunc(tempData,pageValue,feedData.actn))continue;
                if (tempData.deleted) {
                    deleteFromIndexedFeed(tempData.nfId);
                //} else if (tempData.sharedFeed) { //todo : may be no use now ! please check calls when user share from share controller
                //    _d1 = createFeed(tempData.sharedFeed);
                //    tempData.sharedFeed = {};//no need
                //    _d = createFeed(tempData);
                //    _d.shares(_d1);
                //    // TODO may be original feed d1 should remove from here !
                //    $feed.save(_d.getMapKey(), _d);
                } else if (tempData.whShrLst || tempData.orgFd) { // when share feed comes from server
                    if(!!options.processWhoShare && angular.isFunction(options.processWhoShare)){
                        options.processWhoShare.call(null,tempData,$feed,pageValue);
                    }else{
                        if(tempData.orgFd){
                            _d = createFeed(tempData);
                            if (!(_d1 = _getFeed(tempData.orgFd.nfId))) {
                            _d1 = createFeed(tempData.orgFd);
                            }
                        }else{
                            _d = createFeed(tempData.whShrLst[0]);
                            if (!(_d1 = _getFeed(tempData.nfId))) {
                            _d1 = createFeed(tempData);
                            }
                        }
                        _d.shares(_d1);
                        $feed.save(_d.getMapKey(), _d);
                        saveOrginalFeedIntoRemoved(_d1,_d.getKey());
                    }

                } else {
                    _d = createFeed(tempData);
                    $feed.save(_d.getMapKey(), _d);
                }

            }

        }

        function processSingleFeed(feedData){
            processAllFeed(feedData,singlePageFilter);
        }

        function getCurrentPageFilter(pageValue){
            if(!pageValue){
                pageValue = getCurrentPageValue();
            }
            switch (pageValue.action) {
                case OTYPES.TYPE_MY_NEWS_FEED:
                case OTYPES.TYPE_FRIEND_NEWSFEED:
                    return pageValue.ptype ==3 ?newsPortalProfileFilter : CurrentUserPageFilter;
                //case OTYPES.TYPE_FRIEND_NEWSFEED+".3":
                  //  return newsPortalPageFilter;
                case OTYPES.TYPE_GROUP_NEWS_FEED:
                    return GroupNewsFeedFilter;
                case OTYPES.TYPE_MEDIAS_NEWS_FEED:
                    return MediaNewsFeedFilter;
                case OTYPES.TYPE_NEWS_PORTAL_FEED:
                    return NewsPortalFeedFilter;
                case OTYPES.TYPE_SINGLE_STATUS_NOTIFICATION_OR_SHARE_DETAILS:
                    return singlePageFilter;
                case OTYPES.TYPE_NEWS_FEED:
                default :
                    return DashboardFeedFilter;

            }
        }

        function pushFeed(feedData) {
            var pageValue = getCurrentPageValue();
            switch (pageValue.action) {
                case OTYPES.TYPE_MY_NEWS_FEED:
                    processCurrentUserFeed(feedData);
                    break;
                case OTYPES.TYPE_FRIEND_NEWSFEED:
                    if(pageValue.ptype ==3){
                        processPortalProfileFeed(feedData);
                    }else{
                        processCurrentUserFriendFeed(feedData);
                    }
                    break;
                case OTYPES.TYPE_GROUP_NEWS_FEED:
                    processGroupNewsFeed(feedData);
                    break;
                case OTYPES.TYPE_SINGLE_STATUS_NOTIFICATION_OR_SHARE_DETAILS:
                    processSingleFeed(feedData);
                    break;
                case OTYPES.TYPE_NEWS_FEED:
                    processDashboardFeed(feedData);
                    break;
                case OTYPES.TYPE_MEDIAS_NEWS_FEED :
                    processMediasNewsFeed(feedData);
                    break;
                case OTYPES.TYPE_NEWS_PORTAL_FEED :
                    processNewsPortalFeed(feedData);
                    break;
                //case OTYPES.TYPE_FRIEND_NEWSFEED+".3" :
                  //  processPortalProfileFeed(feedData);
                   // break;
                default:
                    break;
            }

        }
        function processIncomingFeed(){
            var tempData;
            while(incomingFeedData.length && pushInIncomingFeed){
                tempData = incomingFeedData.shift();
                if(!!tempData.callback){
                    tempData.callback.call(null,tempData,true);
                }else{
                    pushFeed([tempData]);
                }

            }
        }
        function saveOrginalFeedIntoRemoved(feed,reference,removedMap){
            if(!removedMap){
                removedMap = getIndexedRemovedFeed();
            }
            feed.reference = reference;
            removedMap.save(feed.getMapKey(),feed);
        }
        function _getRemovedFeed(nfId,removedMap){
            if(!removedMap){
                removedMap = getIndexedRemovedFeed();
            }
            nfId = $$feedMap.getPrefix() + nfId;
            return removedMap.get(nfId);
        }
        function _getFeed(nfId) {
            var $feed;
            $feed = getIndexedFeed();
            nfId = $$feedMap.getPrefix() + nfId;
            return $feed.get(nfId);

        }

        function _addFeed(feed) {
            var $feed = getIndexedFeed();
            $feed.add(feed.getMapKey(), feed);

        }

        function deleteFeed(key,$feed) {
            if(!$feed){
                $feed = getIndexedFeed();
            }
           return $feed.remove($$feedMap.makeKey(key));

        }

        function synchLike(nfId,il,loc){
            if(!nfId)return;
            var f = getFeed(nfId);
            if(f && f.isSingleContentFeed()){
                f.setTotalLikes(loc,il);
                return FEED_SCOPES[nfId];
            }
        }

        function synchComment(nfId,total,is){
            if(!nfId)return;
            var f = FEED_SCOPES[nfId];
            if(f && f.feed.isSingleContentFeed()){
                f.feed.setTotalComment(total,is);
                return f;
            }
        }



        // function updateWhoLike(message, feed) {
        //     var commentOrFeed;
        //     if (!feed || (!!feed && feed.getKey() !== message.nfId)) {
        //         feed = _getFeed(message.nfId);
        //     }
        //     if (!feed)return;
        //     if (!!message.cmnId) {
        //         commentOrFeed = feed.getCommentByKey(message.cmnId) || feed;
        //     } else {
        //         commentOrFeed = feed;
        //     }
        //     var likes = message.likes || [];
        //     for (var i = 0; i < likes.length; i++) {
        //         commentOrFeed.incomingWhoLikes(likes[i]);
        //     }

        // }

        function processUpdates(json) {

            var f = _getFeed(json.nfId);
            var scope = FEED_SCOPES[json.nfId];
            if (!f || !scope){
                return;
            }

            switch (json.actn) {

                case OTYPES.TYPE_UPDATE_EDIT_STATUS:
                    f.update(json);

                    break;

                case OTYPES.TYPE_UPDATE_LIKE_STATUS:
                case OTYPES.TYPE_UPDATE_UNLIKE_STATUS:

                    f.setTotalLikes(json.loc);
                    f.setFeedTopMessage();
                    break;

                case OTYPES.TYPE_UPDATE_ADD_STATUS_COMMENT:
                case OTYPES.TYPE_UPDATE_DELETE_STATUS_COMMENT :

                    f.setTotalComment(json.loc);
                    f.setFeedTopMessage();
                    break;

            }
            return scope;
        }

        function updateDeleteStatus(json) {
            deleteFeed(json.nfId);
        }

       function updateShareStatus(json,forceProcess,selfShared,currentUser) {
            if(pushInIncomingFeed && !forceProcess){
                json.callback = updateShareStatus;
                var filterFunc = getCurrentPageFilter();
                if(filterFunc.call(null,json.newsFeed)){ //validating if this feed should processed via current page
                    incomingFeedData.push(json);
                }
                return;
            }

            var key = json.newsFeed.orgFd && json.newsFeed.orgFd.nfId;
            if(!key)return;
            var f = _getFeed(key);
            var $removed = getIndexedRemovedFeed();
            if(f){ // searched in main feed list
                // note : its found in main list so nobody shares it so we just deletes it
                //and update with latest with common function
                if(selfShared){
                    f.setActivity(json.newsFeed.orgFd);
                    return FEED_SCOPES[f.getKey()];
                }else{
                    saveOrginalFeedIntoRemoved(f,json.newsFeed.nfId,$removed);
                    deleteFeed(f.getKey());
                }
            }else{ // searched for previously added to removed feed
                f = _getRemovedFeed(key,$removed);
                if(f){ // found in removed feed
                    //todo : synch current three feed
                    var filterFunc = getCurrentPageFilter();
                    processAllFeed([json.newsFeed],filterFunc,{processWhoShare:
                        function(message,$feed,pageValue){
                            var _d,_d1,orginal = _getFeed(f.reference);//getting orginal feed
                                if(!orginal){
                                    pushFeed([message]); // normally update
                                    return;
                                }
                            if(pageValue.page == OTYPES.TYPE_FRIEND_NEWSFEED || pageValue.page == OTYPES.TYPE_MY_NEWS_FEED){
                                return;// todo : check if there needed to update
                            }
                            f.update(message,true);// updating the old feed without the tm to keep the order
                            if(selfShared){
                                f.addShareUser(currentUser);
                                orginal.updateShareMessage();
                                orginal.setActivity(message);
                                return FEED_SCOPES[orginal.getKey()];
                            }
                            // todo : when current user share status the whoShare doesn't contain the current user data. instead previous share user data.need to be checked with auth
                                // deleting the feed from orginal feed list
                            _d = createFeed(message); //creating new feed
                            _d.setActivity(message.orgFd);//set orginal feed activity
                            //_d1 = createFeed(tempData);
                            //_d1.addShareUser(orginal.getOrginalFeed().getShareUsers());//pushing orginal user
                                deleteFeed(f.reference);
                                _d.shares(f);
                                $feed.save(_d.getMapKey(), _d);


                        }
                    });
                    return;
                // todo here you should return after calling processAllFeed with whoShare processor
                }else{ //also not found in removed feed . means the orginal feed does not exist in removed feed list
                    // so saving the orginal feed into removed feed list.
                    //note : processAllFeed and processUsersFeed saves orginal feed
                }

            }
            pushFeed([json.newsFeed]);
        }



        function updateAddStatus(json) {
            if (!json.imageList && json.type === 1) { // when updates comes then it brings image imformation directly to feed data
                json.imageList = [json];            // but feedmap processes image in imagesList
            }
            if(pushInIncomingFeed){
                var filterFunc = getCurrentPageFilter();
                if(filterFunc.call(null,json,getCurrentPageValue())){
                    incomingFeedData.push(json);
                }
            }else{
                pushFeed([json]);
            }

        }

        function _process(json) {
            //console.dir(json);
            var i, ignore = false, feedData = angular.isArray(json) ? json[0] : json;
            if (ignoreActions.length) {
                for (i = 0; i < ignoreActions.length; i++) {
                    if (ignoreActions[i].action === feedData.actn) {
                        ignore = ignoreActions[i].callback.call(null, feedData);
                    }
                }
            }
            if (!!processorFunctions[feedData.actn] && !ignore) {
               return processorFunctions[feedData.actn].call(null, feedData);
            }

        }

        //------------------------- Public -------------------------

        function getFeed(key) {
            // key = $$feedMap.getPrefix() + key;
            return _getFeed(key);
        }

        function addIgnoreFilter(action, callback) {
            var key = Utils.getUniqueID();

            ignoreActions.push({
                key: key,
                action: action,
                callback: callback
            });

            return key;
        }

        function removeIgnoreFilter(key) {
            var idx = -1;

            for (var i = 0; i < ignoreActions.length; i++) {
                if (ignoreActions[i].key === key) {
                    idx = i;
                }
            }

            return idx != -1 ? ignoreActions.splice(idx, 1) : [];
        }

        function setFactoryKey(key) {
            feed_index = key;
            if (!feedList.hasOwnProperty(feed_index)){
                feedList[feed_index] = {
                    data: $$stackedMap.createNew($$feedMap.getSortIndex(), 'desc'),
                    removed : $$stackedMap.createNew(),//removed feed
                    no_more_feed: false
                };
            }

            //feedList.special = feed.special || $$stackedMap.createNew($$feedMap.getSortIndex(), 'desc');

        }

        function process(json) {
          return _process(json);
        }

        function getFeedFilter() {
            return function (m) {
                return !!processorFunctions[m.actn];
            };

        }
        function getRawFeeds() {
            return getIndexedFeed().all();

        }

        function getFeeds() {
           // var t0 = performance.now();

            //console.dir($feed.all());
            var $feed = getIndexedFeed();
            return $feed.all();
        }
        function noMoreFeed() {
            return feedList.hasOwnProperty(feed_index) ? feedList[feed_index].no_more_feed : false;

        }
        function requestForFeed(ob) {
            var d_limit = AC.FEED_LIMIT;
            ob = angular.copy(ob || {});
            ob.pvtid = pvtId || 0;
            ob.st = getFeeds().length || 0
            switch (Utils.feedColumn()) {
                case 1:
                     d_limit = 5;
                    break;
                case 2:
                 d_limit = 6;
                break;
                case 3:
                     d_limit = 9;
                    break;
            };
            ob.lmt = ob.lmt || d_limit;

            return $$connector.send(ob, OTYPES.REQUEST_TYPE.REQUEST);
        }
        function initFeedRequest(ob){
            ob = angular.copy(ob || {});
           // ob.lmt = 5;
            ob.scl = 2;
            ob.tm = 0;
            requestForFeed(ob);
        }

        function requestForMoreFeed(ob, scl) {
            var timestamp = getMinTm();
            //todo : if scl == 1 we need to send max tm instead of min tm
            ob = angular.copy(ob || {});
            ob.scl = scl || 2;
            ob.tm = timestamp ? timestamp : MIN_TIMESTAMP;
            return requestForFeed(ob);

        }
        function getSingleFeed(feedId, whoShare) {

            var payload = {
                actn: OTYPES.TYPE_SINGLE_STATUS_NOTIFICATION_OR_SHARE_DETAILS,
                nfId: feedId
            };

            var deffer = $q.defer();

            var feedObj = getFeed(feedId);

            if(!feedObj){

                $$connector.request(payload, OTYPES.REQUEST_TYPE.REQUEST)
                    .then(function(feedData){
                        if(feedData.sucs === true){

                            // pushFeed(feedData);
                            //
                            // if( !!whoShare){
                            //     pushFeed(feedData);
                            //     var whoShareFeedId = getWhoShareFeedId(feedData);
                            //     feedObj = getFeed(whoShareFeedId);
                            // }else{
                            //     deleteWhoShareFromSingleFeedData(feedData);
                            //     pushFeed(feedData);
                            //     feedObj = getFeed(feedId);
                            // }
                            var message = angular.isArray(feedData) ? feedData : feedData.newsFeedList[0];
                            if( !!whoShare && message.orgFd){
                                if( message.orgFd ){
                                    feedObj = createFeed(message);
                                    var orginalFeed = createFeed(message.orgFd);
                                    feedObj.shares(orginalFeed);
                                }
                            }else{
                                feedObj = createFeed(message);
                            }

                            if(feedObj){
                                var $feed = getIndexedFeed();
                                $feed.save(feedObj.getMapKey(), feedObj);
                            }

                            deffer.resolve(feedObj);
                        }else{
                            deffer.resolve(false);
                        }

                    }, function(errData){
                        deffer.reject(errData);
                    });

            }else{

                deffer.resolve(feedObj);
            }

            return deffer.promise;

        }


        function addFeed(ob, user,content_shared) {
            var defer = $q.defer(),lengthPadding = 0,
                _d, /* _d means json data */
                $feed = getIndexedFeed(),
                nfId = Utils.getUniqueID();
                ob.stsTags = [];
                var tempText = '';
                //processing for sts tag
                var tempText = '';
                //processing for sts tag
                if(ob.text){
                   tempText =  ob.text.replace(/##([\d]+)##/g,function(match,$1,index){
                         var offset;
                         offset = index - lengthPadding;
                         ob.stsTags.push({
                            pstn : offset,
                            utId : $1
                         });
                         lengthPadding += match.length;
                        return "";
                    });
                   ob.text = tempText;
                }

            if(!content_shared){
                _d = createFeed({
                    nfId: nfId,
                    fpvc: ob.fpvc,
                    sts: ob.text,
                    lat : ob.lat || 9999,//default 9999
                    lng : ob.lng || 9999,//default 9999
                    //imgIds: ob.images,
                    grpId: ob.group || "",
                    friendId: ob.friend || "",
                    fndId : ob.friend || "",
                    mdLst : ob.mdIds || [],
                    // captionList: ob.captionList,
                    isNew: 1,
                    pending: true,
                    lctn: ob.lctn || '',
                    lnkDmn: ob.lnkDmn || '',
                    lnkDsc: ob.lnkDsc || '',
                    lnkTtl: ob.lnkTtl || '',
                    lnkURL: ob.lnkURL || '',
                    lnlImgURL: ob.lnlImgURL || ''
                }, user);
             $feed.save(_d.getMapKey(), _d);
           }else if(ob.feed){
                _d = ob.feed;
           }else{
                _d = getFeed(ob.nfId);
           }




            var newFeedData = {};
            if(ob.cntntIDLst){
                newFeedData.cntntIDLst = ob.cntntIDLst;
            }
            if (ob.group) {
                newFeedData.grpId = ob.group;
            }

            if (ob.friend) {
                newFeedData.fndId = parseInt(ob.friend);
            }

            if (ob.lctn) {
                newFeedData.lctn = ob.lctn.utf8Encode();
            }

            if( ob.lnkDmn){
                newFeedData.lnkDmn = ob.lnkDmn.utf8Encode();
            }

            if( ob.lnkDsc){
                newFeedData.lnkDsc = ob.lnkDsc.utf8Encode();
            }

            if( ob.lnkTtl){
                newFeedData.lnkTtl = ob.lnkTtl.utf8Encode();
            }

            if( ob.lnkURL){
                newFeedData.lnkURL = ob.lnkURL.utf8Encode();
            }

            if( ob.lnlImgURL){
                newFeedData.lnlImgURL = ob.lnlImgURL.utf8Encode();
            }
            if(ob.stsTags.length){
                newFeedData.stsTags = ob.stsTags;
            }

            newFeedData.actn = OTYPES.TYPE_ADD_STATUS;

            if (!!ob.images && ob.images.length > 0) {
                if (ob.images.length === 1) {//  type for single image
                    newFeedData.type = OTYPES.NEWS_FEED_TYPE_IMAGE;
                    newFeedData = angular.extend({}, newFeedData, ob.images[0].getAuthData());
                } else {// type for multiple images
                    newFeedData.actn = OTYPES.TYPE_ADD_MULTI_IMAGE;
                    newFeedData.type = OTYPES.NEWS_FEED_TYPE_MULTIPLE_IMAGE;
                    // imageList: [{ih, iw, cptn, iurl}]
                    newFeedData.imageList = [];
                    for (var i = 0, lt = ob.images.length; i < lt; i++) {
                        newFeedData.imageList.push(ob.images[i].getAuthData());
                    }
                }
            } else if (!!ob.videos && ob.videos.length > 0) {
                newFeedData.mdaCntntDTO  = {
                    albId: fileUploadService.getUploadAlbum(),
                    htgLst: [],
                    mdaLst: [],
                    mdaT: AC.NEWS_FEED_MEDIA_TYPE_VIDEO,
                    lnkT: AC.NEWS_FEED_MEDIA_TYPE_VIDEO
                };
                newFeedData.type = OTYPES.NEWS_FEED_TYPE_VIDEO;

                for (var i = 0, lt = ob.videos.length; i < lt; i++) {
                    newFeedData.mdaCntntDTO.mdaLst.push((ob.videos[i].getAuthData(true)));
                    if (i === 0) {
                        newFeedData.mdaCntntDTO.htgLst = newFeedData.mdaCntntDTO.mdaLst[0].htgLst;
                    }
                }
            } else if (!!ob.audios && ob.audios.length > 0) {
                newFeedData.mdaCntntDTO  = {
                    albId: fileUploadService.getUploadAlbum(),
                    htgLst: [],
                    mdaLst: [],
                    mdaT: AC.NEWS_FEED_MEDIA_TYPE_AUDIO,
                    lnkT: AC.NEWS_FEED_MEDIA_TYPE_AUDIO
                };
                newFeedData.type = OTYPES.NEWS_FEED_TYPE_AUDIO;

                for (var i = 0, lt = ob.audios.length; i < lt; i++) {
                    newFeedData.mdaCntntDTO.mdaLst.push((ob.audios[i].getAuthData(true)));
                    if (i === 0) {
                        newFeedData.mdaCntntDTO.htgLst = newFeedData.mdaCntntDTO.mdaLst[0].htgLst;
                    }
                }
            } else {// setting action and type for only text post
                newFeedData.actn = OTYPES.TYPE_ADD_STATUS;
                if(content_shared){
                    newFeedData.type = ob.audio ? OTYPES.NEWS_FEED_TYPE_AUDIO:OTYPES.NEWS_FEED_TYPE_VIDEO;
                }else{
                    newFeedData.type = OTYPES.NEWS_FEED_TYPE_STATUS;
                }

            }

            if(ob.mdIds){
                newFeedData.mdIds = ob.mdIds;
            }
            if(ob.tFrndIds){
                newFeedData.tFrndIds = ob.tFrndIds;
            }

            newFeedData.vldt = ob.vldt || "-1";// set validity for timout status // implement it while implementing timout status
            newFeedData.lng = ob.lng || 9999;
            newFeedData.lat = ob.lat || 9999;
            newFeedData.sts = ob.text.utf8Encode(); // setting the feed text
            newFeedData.fpvc = ob.fpvc || 2;

            $$connector.request(newFeedData, OTYPES.REQUEST_TYPE.UPDATE).then(function (json) {
                $rootScope.$broadcast(SystemEvents.FILE_UPLOAD.UPLOADS_POSTED);
                if (json.sucs) {
                    //console.dir(json);
                    if(!content_shared){
                        $feed.remove(_d.getMapKey());
                        if (json.type === OTYPES.TYPE_SINGLE_IMAGE_STATUS) {
                            json.imageList = [json];
                        }
                        pushFeed([json]);
                        // Ringalert.show(json, 'success');
                    }else{
                        _d && _d.share(json.mdaCntntLst[0].is,json.mdaCntntLst[0].ns);
                    }
                    defer.resolve(json);
                } else {
                    if(!content_shared){
                        $feed.remove(_d.getMapKey());
                        Ringalert.show(json, 'error');
                    }
                    defer.reject(json);
                }

            }, function (reason) {
                if(!content_shared){
                    $feed.remove(_d.getMapKey());
                    Ringalert.show(json, 'error');
                }
                defer.reject(json);
            });

            return defer.promise;
        }

        function shareFeed(ob) {
            if(ob.addShare){
                return addFeed(ob,ob.user,true);
            }
            var defer = $q.defer();

            var data = {
                actn: OTYPES.ACTION_SHARE_STATUS,
                sfId: ob.feed.getKey(),
                type: 2,
                sts: ob.text.utf8Encode(),
            };

            if(ob.mdIds){
                data.mdIds = ob.mdIds;
            }

            if(ob.tFrndIds){
                data.tFrndIds = ob.tFrndIds;
            }

            if(!!ob.location){

                if(!!ob.location.description){
                    data['lctn'] = ob.location.description.utf8Encode();
                }

                if(!!ob.location.lat){
                    data['lat'] = ob.location.lat;
                    data['lng'] = ob.location.lng;
                }
            }

            $$connector.request(data, OTYPES.REQUEST_TYPE.UPDATE).then(function (json) {
                // todo remove orginal feed from feedlist and made a function to prevent duplicacy on share feed
                if (!!json.sucs) {
                    // console.dir(json);
                    //$feed.remove(_d.getMapKey());
                    updateShareStatus(json,true,true,Auth.currentUser());
                    ////console.log("after");
                    ////console.dir($feed.all());
                    ob.feed.share(true);

                    defer.resolve(json);
                } else {

                    defer.reject(json);

                    //$feed.remove(_d.getMapKey());
                }


            }, function (reason) {
                defer.reject(reason);
            });
            //console.log("before");
            //console.dir($feed.all());
            return defer.promise;
        }



        function deleteFeedService(user, key) {
            var defer = $q.defer();
            var feed = _getFeed(key);
            var $feed = getIndexedFeed();
            if(!feed){
                setTimeout(function(){
                    defer.reject("Can't Delete Invalid Feed");
                });
                return defer.promise;
            }


            if (!feed.user().isCurrentUser(user.getKey())) {
                setTimeout(function () {
                    defer.reject("You are not authorized to delete this feed.");
                }, 100);
            }

            if (feed !== false) {
                // console.log($feed);

                deleteFeed(feed.getKey(),$feed);
                /** TODO : We Should Not Replace Here instead make the feed in gray/pending mode **/

                $$connector.request({
                    actn: OTYPES.TYPE_DELETE_STATUS,
                    nfId: key
                }, OTYPES.REQUEST_TYPE.UPDATE).then(function (json) {
                    if (!json.sucs) {
                        _addFeed(feed);
                        defer.reject(json);
                    } else {
                        defer.resolve(json);
                    }

                }, function (json) {
                    _addFeed(feed);
                    defer.reject(json);

                });

            } else {
                setTimeout(function () {
                    defer.reject("Feed Not Found!");
                }, 100);
            }

            return defer.promise;
        }

        function saveFeedService(key,optn){
            var obj = {
                actn:OTYPES.PORTAL.ACTION_SAVE_UNSAVE_NEWSPORTAL_FEED,
                optn: optn,
                feedIdList: [
                    key
                ]
            }
            return $$connector.request(obj, OTYPES.REQUEST_TYPE.UPDATE)
        }

        function updateFeed(user, feed, status, location, ogData, feedEmotions, taggedFriends) {
            if (!angular.isObject(feed)){
                feed = _getFeed(key);
            }

            if (!feed || !feed.user().isCurrentUser(user.getKey())) {

                return;
            }

            var defer = $q.defer(),
            	key   = feed.getKey(),
                oldText = feed.text(),
                oldLocation = feed.getLocationInfo(),
                oldEmotions = feed.getFeelings(),
                stsTags = [],lengthPadding=0,tempText;


                if(status){
                   tempText =  status.replace(/##([\d]+)##/g,function(match,$1,index){
                         var offset;
                         offset = index - lengthPadding
                         stsTags.push({
                            pstn : offset,
                            utId : $1
                         });
                         lengthPadding += match.length;
                        return "";
                    });
                   status = tempText;
                }


            var dataToUpdate = {
                actn: OTYPES.TYPE_EDIT_STATUS,
                nfId: key,
                sts: status.utf8Encode()
            };

            if(stsTags.length){
                dataToUpdate['stsTags'] = stsTags;
            }

            location = location || {};
            dataToUpdate['lctn'] = !!location.description ? location.description.utf8Encode() : '';
            dataToUpdate['lat'] = location.lat || 9999;
            dataToUpdate['lng'] = location.lng || 9999;


            //http://192.168.1.117/ringID/ringIDWeb/issues/689
            var shouldUpdateLinkShareInfo = ogData &&(!feed.hasOgData() || feed.getLinkUrl() != ogData.url || feed.getLinkImageUrl() != ogData.image);

            if( shouldUpdateLinkShareInfo ){
                dataToUpdate['lnkDmn'] = ogData.domain || '';
                dataToUpdate['lnkDsc'] = ogData.description ? ogData.description.utf8Encode() : '';
                dataToUpdate['lnkTtl'] = ogData.title ? ogData.title.utf8Encode() : '';
                dataToUpdate['lnkURL'] = ogData.url ? ogData.url.utf8Encode() : '';
                dataToUpdate['lnlImgURL'] = ogData.image || '';
            }

            var shouldUpdateFeedEmotion = false;
            if(!!feedEmotions && !!feedEmotions.id){
                dataToUpdate.mdIds = [feedEmotions.id]; // we will support one emotion at a time for now
                shouldUpdateFeedEmotion = true;
            }else{
                dataToUpdate.mdIds = [];
                shouldUpdateFeedEmotion = true;
            }


            if( !!taggedFriends){
                if(!!taggedFriends.removed){
                    dataToUpdate['rTFrndIds'] = taggedFriends.removed;
                }
                if(!!taggedFriends.new){
                    dataToUpdate['tFrndIds'] = taggedFriends.new;
                }

            }

            if (feed !== false) {
                feed.setText(status,stsTags);
                feed.setLocationInfo(location);

                if(shouldUpdateFeedEmotion){
                    feed.setFeelings(feedEmotions);
                }

                if( shouldUpdateLinkShareInfo ){
                    feed.setOgData(ogData);
                }

                $$connector.request(dataToUpdate, OTYPES.REQUEST_TYPE.UPDATE).then(function (json) {
                    if (json.sucs === false) {
                        feed.setText(oldText);
                        feed.setLocationInfo(oldLocation);

                        if(shouldUpdateFeedEmotion){
                            feed.setFeelings(oldEmotions);
                        }


                        if( shouldUpdateLinkShareInfo ) {
                            feed.setOgData(oldOgData);
                        }


                        defer.reject(json);
                    } else {
                        defer.resolve(json);
                    }
                }, function (json) {
                    feed.setText(oldText);
                    feed.setLocationInfo(oldLocation);

                    if(shouldUpdateFeedEmotion){
                        feed.setFeelings(oldEmotions);
                    }


                    if( shouldUpdateLinkShareInfo ) {
                        feed.setOgData(oldOgData);
                    }

                    defer.reject(json);
                });

                //$feed.remove(feed.getMapKey());
            }
            return defer.promise;
        }

            function moreFeedText(feed) {
            //console.log(obj);
            var defer = $q.defer(),
                payload = {
                    actn: OTYPES.TYPE_SINGLE_STATUS_NOTIFICATION_OR_SHARE_DETAILS,
                    nfId: feed.getKey()
                };
            $$connector.request(payload, OTYPES.REQUEST_TYPE.REQUEST).then(function (json) {
                if (json.sucs) {
                    //if (!!json.newsFeedList) {
                        //feed.parseMoreText(json.newsFeedList[0]);
                    //} else {
                        //feed.parseMoreText(json);
                    //}
                    defer.resolve(json);
                } else {
                    Ringalert.show(json, 'error');
                    defer.reject();
                }
            }, function (reason) {

                Ringalert.show(reason, 'error');
                defer.reject();
            });

            return defer.promise;
        }

        function getTagUsers(feed){
            //todo : remember to implement limit and starting offset
            return $$connector.pull({
                actn : OTYPES.TYPE_TAG_USER_LIST,
                nfId : feed.getKey()
            },OTYPES.REQUEST_TYPE.REQUEST);
        }


        function getSingleFeedPageKey(feedId){
            return OTYPES.TYPE_SINGLE_STATUS_NOTIFICATION_OR_SHARE_DETAILS + "." + feedId ;
        }

        function getWhoShareFeedId(rawFeedData){
            var message = angular.isArray(rawFeedData) ? rawFeedData : rawFeedData.newsFeedList;
            if( message.length > 0 && message[0].whShrLst[0] ){
                return message[0].whShrLst[0].nfId;
            }
            return false;

        }

        function deleteWhoShareFromSingleFeedData(rawFeedData){
            var message = angular.isArray(rawFeedData) ? rawFeedData : rawFeedData.newsFeedList;
            if( message.length > 0 && message[0].whShrLst[0] ){
                delete message[0].whShrLst[0];
            }
        }

        function feedDigset(feedKey){

            var scope = FEED_SCOPES[feedKey]
            if(!!scope){
                scope.$rgDigest();
            }
        }



        /**
         * This function is a fake feed generator
         * were created for who share details fetch from feedWhoShareController
         *
         */
        //function fakeFeedGenerator(starting,length){
        //    var defer = $q.defer();
        //    starting = starting || 0;
        //    length = length || 5;
        //    var DataHouse = [{"nfId":4841,"uId":"2110010010","fndId":"2110063704","utId":5,"sts":"","tm":1442465461657,"at":1442465461657,"type":3,"nc":0,"nl":0,"ns":0,"il":0,"ic":0,"is":0,"sucs":true,"fn":"Socrates","ffn":"Tom","afn":"","prIm":"2110010010/1442126728495.jpg","prImPr":1,"fprIm":"","fprImPr":1,"imageList":[{"imgId":478,"iurl":"2110010010/1442465443047.jpg","cptn":"","ih":1280,"iw":720,"imT":1,"albId":"default","albn":"Feed Photos","tm":1442465461657,"nl":0,"il":0,"ic":0,"nc":0},{"imgId":479,"iurl":"2110010010/1442465454105.jpg","cptn":"","ih":1280,"iw":720,"imT":1,"albId":"default","albn":"Feed Photos","tm":1442465461657,"nl":0,"il":0,"ic":0,"nc":0}],"sfId":0,"tim":2,"grpId":0,"actvt":0,"auId":0,"imc":2,"sc":false},
        //
        //        {"nfId":4832,"uId":"2110010010","utId":5,"sts":"","tm":1442465426137,"at":1442465426137,"type":1,"nc":0,"nl":0,"ns":0,"il":0,"ic":0,"is":0,"sucs":true,"fn":"Socrates","afn":"","prIm":"2110010010/1442126728495.jpg","prImPr":1,"imageList":[{"imgId":477,"iurl":"2110010010/1442465417178.jpg","ih":1280,"iw":720,"imT":1,"albId":"default","albn":"Feed Photos","tm":1442465426137,"nl":0,"il":0,"ic":0,"nc":0}],"sfId":0,"tim":1,"grpId":0,"actvt":0,"auId":0,"imc":0,"sc":false},
        //
        //        {"nfId":4843,"uId":"2110010010","fndId":"2110063704","utId":5,"sts":"","tm":1442465461657,"at":1442465461657,"type":3,"nc":0,"nl":0,"ns":0,"il":0,"ic":0,"is":0,"sucs":true,"fn":"Socrates","ffn":"Tom","afn":"","prIm":"2110010010/1442126728495.jpg","prImPr":1,"fprIm":"","fprImPr":1,"imageList":[{},{}],"sfId":0,"tim":2,"grpId":0,"actvt":0,"auId":0,"imc":2,"sc":false},
        //
        //        {"nfId":4834,"uId":"2110010010","utId":5,"sts":"","tm":1442465426137,"at":1442465426137,"type":1,"nc":0,"nl":0,"ns":0,"il":0,"ic":0,"is":0,"sucs":true,"fn":"Socrates","afn":"","prIm":"2110010010/1442126728495.jpg","prImPr":1,"imageList":[{}],"sfId":0,"tim":1,"grpId":0,"actvt":0,"auId":0,"imc":0,"sc":false},
        //
        //        {"nfId":4825,"uId":"2110010010","utId":5,"sts":"","tm":1442465404677,"at":1442465404677,"type":1,"nc":0,"nl":0,"ns":0,"il":0,"ic":0,"is":0,"sucs":true,"fn":"Socrates","afn":"","prIm":"2110010010/1442126728495.jpg","prImPr":1,"imageList":[{"imgId":476,"iurl":"2110010010/1442465396383.jpg","ih":1280,"iw":720,"imT":1,"albId":"default","albn":"Feed Photos","tm":1442465404677,"nl":0,"il":0,"ic":0,"nc":0}],"sfId":0,"tim":1,"grpId":0,"actvt":0,"auId":0,"imc":0,"sc":false},
        //        {"nfId":4646,"uId":"2110010130","utId":107,"sts":"fdsfsdfsdf","tm":1442407330406,"at":1442407330406,"type":2,"nc":0,"nl":0,"ns":0,"il":0,"ic":0,"is":0,"sucs":true,"fn":"I am Dracula","afn":"","prIm":"2110010130/1440056454790.jpg","prImPr":1,"sfId":0,"grpId":0,"actvt":0,"auId":0,"imc":0,"sc":false},
        //
        //        {"nfId":4827,"uId":"2110010010","utId":5,"sts":"","tm":1442465404677,"at":1442465404677,"type":1,"nc":0,"nl":0,"ns":0,"il":0,"ic":0,"is":0,"sucs":true,"fn":"Socrates","afn":"","prIm":"2110010010/1442126728495.jpg","prImPr":1,"imageList":[{}],"sfId":0,"tim":1,"grpId":0,"actvt":0,"auId":0,"imc":0,"sc":false},
        //
        //        {"nfId":4648,"uId":"2110010130","utId":107,"sts":"fdsfsdfsdf","tm":1442407330406,"at":1442407330406,"type":2,"nc":0,"nl":0,"ns":0,"il":0,"ic":0,"is":0,"sucs":true,"fn":"I am Dracula","afn":"","prIm":"2110010130/1440056454790.jpg","prImPr":1,"sfId":0,"grpId":0,"actvt":0,"auId":0,"imc":0,"sc":false},
        //
        //        {"nfId":4639,"uId":"2110010130","utId":107,"sts":"sadasdasdasd","tm":1442407276553,"at":1442407276553,"type":2,"nc":0,"nl":0,"ns":0,"il":0,"ic":0,"is":0,"sucs":true,"fn":"I am Dracula","afn":"","prIm":"2110010130/1440056454790.jpg","prImPr":1,"sfId":0,"grpId":0,"actvt":0,"auId":0,"imc":0,"sc":false},
        //
        //        {"nfId":4621,"uId":"2110010130","utId":107,"sts":"sadasdasd","tm":1442407247081,"at":1442407247081,"type":2,"nc":0,"nl":0,"ns":0,"il":0,"ic":0,"is":0,"sucs":true,"fn":"I am Dracula","afn":"","prIm":"2110010130/1440056454790.jpg","prImPr":1,"sfId":0,"grpId":0,"actvt":0,"auId":0,"imc":0,"sc":false},
        //        {"nfId":4632,"uId":"2110010130","utId":107,"sts":"sadasdasdasd","tm":1442407276553,"at":1442407276553,"type":2,"nc":0,"nl":0,"ns":0,"il":0,"ic":0,"is":0,"sucs":true,"fn":"I am Dracula","afn":"","prIm":"2110010130/1440056454790.jpg","prImPr":1,"sfId":0,"grpId":0,"actvt":0,"auId":0,"imc":0,"sc":false},
        //
        //        {"nfId":4623,"uId":"2110010130","utId":107,"sts":"sadasdasd","tm":1442407247081,"at":1442407247081,"type":2,"nc":0,"nl":0,"ns":0,"il":0,"ic":0,"is":0,"sucs":true,"fn":"I am Dracula","afn":"","prIm":"2110010130/1440056454790.jpg","prImPr":1,"sfId":0,"grpId":0,"actvt":0,"auId":0,"imc":0,"sc":false},
        //
        //        {"nfId":4614,"uId":"2110010130","utId":107,"sts":"asdasdasd","tm":1442407135324,"at":1442407135324,"type":2,"nc":0,"nl":0,"ns":0,"il":0,"ic":0,"is":0,"sucs":true,"fn":"I am Dracula","afn":"","prIm":"2110010130/1440056454790.jpg","prImPr":1,"sfId":0,"grpId":0,"actvt":0,"auId":0,"imc":0,"sc":false},
        //
        //        {"nfId":4605,"uId":"2110010130","utId":107,"sts":"asdasdasd","tm":1442407104103,"at":1442407104103,"type":2,"nc":0,"nl":0,"ns":0,"il":0,"ic":0,"is":0,"sucs":true,"fn":"I am Dracula","afn":"","prIm":"2110010130/1440056454790.jpg","prImPr":1,"sfId":0,"grpId":0,"actvt":0,"auId":0,"imc":0,"sc":false},
        //
        //        {"nfId":4616,"uId":"2110010130","utId":107,"sts":"asdasdasd","tm":1442407135324,"at":1442407135324,"type":2,"nc":0,"nl":0,"ns":0,"il":0,"ic":0,"is":0,"sucs":true,"fn":"I am Dracula","afn":"","prIm":"2110010130/1440056454790.jpg","prImPr":1,"sfId":0,"grpId":0,"actvt":0,"auId":0,"imc":0,"sc":false},
        //
        //        {"nfId":4607,"uId":"2110010130","utId":107,"sts":"asdasdasd","tm":1442407104103,"at":1442407104103,"type":2,"nc":0,"nl":0,"ns":0,"il":0,"ic":0,"is":0,"sucs":true,"fn":"I am Dracula","afn":"","prIm":"2110010130/1440056454790.jpg","prImPr":1,"sfId":0,"grpId":0,"actvt":0,"auId":0,"imc":0,"sc":false},
        //
        //        {"nfId":4588,"uId":"2110010130","utId":107,"sts":"The awesome post","tm":1442405763121,"at":1442405763121,"type":3,"nc":0,"nl":0,"ns":0,"il":0,"ic":0,"is":0,"sucs":true,"fn":"I am Dracula","afn":"","prIm":"2110010130/1440056454790.jpg","prImPr":1,"imageList":[{"imgId":460,"iurl":"2110010130/1442405663379.jpg","cptn":"The awesome guitter","ih":768,"iw":1024,"imT":1,"albId":"default","albn":"Feed Photos","tm":1442405763121,"nl":0,"il":0,"ic":0,"nc":0},{"imgId":461,"iurl":"2110010130/1442405663380.jpg","cptn":"The awesome sunflower","ih":768,"iw":1024,"imT":1,"albId":"default","albn":"Feed Photos","tm":1442405763121,"nl":0,"il":0,"ic":0,"nc":0},{"imgId":459,"iurl":"2110010130/1442405663376.jpg","cptn":"The awesome Flower","ih":768,"iw":1024,"imT":1,"albId":"default","albn":"Feed Photos","tm":1442405763121,"nl":0,"il":0,"ic":1,"nc":2}],"sfId":0,"tim":4,"grpId":0,"actvt":0,"auId":0,"imc":4,"sc":false},
        //
        //        {"nfId":4579,"uId":"2110010130","utId":107,"sts":"asdasdasd ads ad asda dsasd","tm":1442405625514,"at":1442405625514,"type":2,"nc":0,"nl":0,"ns":0,"il":0,"ic":0,"is":0,"sucs":true,"fn":"I am Dracula","afn":"","prIm":"2110010130/1440056454790.jpg","prImPr":1,"sfId":0,"grpId":0,"actvt":0,"auId":0,"imc":0,"sc":false},
        //
        //        {"nfId":4581,"uId":"2110010130","utId":107,"sts":"The awesome post","tm":1442405763121,"at":1442405763121,"type":3,"nc":0,"nl":0,"ns":0,"il":0,"ic":0,"is":0,"sucs":true,"fn":"I am Dracula","afn":"","prIm":"2110010130/1440056454790.jpg","prImPr":1,"imageList":[{},{},{}],"sfId":0,"tim":4,"grpId":0,"actvt":0,"auId":0,"imc":4,"sc":false},
        //
        //        {"nfId":4572,"uId":"2110010130","utId":107,"sts":"asdasdasd ads ad asda dsasd","tm":1442405625514,"at":1442405625514,"type":2,"nc":0,"nl":0,"ns":0,"il":0,"ic":0,"is":0,"sucs":true,"fn":"I am Dracula","afn":"","prIm":"2110010130/1440056454790.jpg","prImPr":1,"sfId":0,"grpId":0,"actvt":0,"auId":0,"imc":0,"sc":false}];
        //
        //    setTimeout(function(){
        //        var r_object=[];
        //        for(var i = starting; i < starting + length;i++){
        //            if(i>DataHouse.length)break;
        //            try{
        //                r_object.push($$feedMap.create(DataHouse[i]));
        //            }catch(e){
        //                console.dir(e);
        //            }
        //        }
        //        if(r_object.length){
        //            defer.resolve(r_object);
        //        }else{
        //            defer.reject("no more Feed");
        //        }
        //    },2000);
        //
        //    return defer.promise;
        //}

    }

