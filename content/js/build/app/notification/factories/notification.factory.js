/*
 * © Ipvision
 */


	angular
		.module('ringid.notification')
		.factory('NotificationFactory', NotificationFactory);

		NotificationFactory.$inject = ['$$connector','$q', 'Storage','notificationHttpService', '$$stackedMap', '$$notiMap', 'OPERATION_TYPES', '$rootScope', 'SystemEvents', 'Auth'];
		function NotificationFactory($$connector,$q, Storage, notificationHttpService, $$stackedMap, $$notiMap, OPERATION_TYPES, $rootScope, SystemEvents, Auth) { //jshint ignore:line

			var $notification = $$stackedMap.createNew(true, 'desc'),
                initialized = false,
                OTYPES = OPERATION_TYPES.SYSTEM.NOTIFICATION,

                from_index = 0,
			    notiCounter = 0,
                minUpdateTime = -1,
                state = {
                    loading: false,
                    noMoreData: false,
                };

			var process = function(json){
                var noti, saveNewNoti = true;

                function mergeNoti(n) {

                    function processMerge(merge) {
                        if (n.value.getTime(true) < noti.getTime(true) ) {
                            notiCounter = notiCounter > 0 ? notiCounter-1 : 0;
                            // updatee new noti utid list
                            noti.uIdList(n.value.uIdList());

                            // not same person increase counter
                            noti.setNotiMessage();
                            // new noti is latest
                            $notification.remove(n.value.getKey());
                        } else {
                            // new noti is old.
                            saveNewNoti = false;
                            n.value.uIdList(noti.uIdList());

                            n.value.setNotiMessage();
                            // update old noti utid list
                        }
                    }

                    if (n.value.getMessageType() === noti.getMessageType()) {
                        if (n.value.canMerge() === 1) {
                            switch(n.value.getPopupType()) {
                                case 'feed':
                                    if (n.value.getNewsFeedId() === noti.getNewsFeedId()) {
                                        //if (n.value.getUid() !== noti.getUid()) {
                                        if (!n.value.isInUidList(noti.getUid())) {
                                            processMerge(true);
                                        } else {
                                            processMerge(false);
                                        }
                                    }
                                    break;
                                case 'image':
                                case 'media':
                                    if (n.value.getImgId() === noti.getImgId()) {
                                        //if (n.value.getUid() !== noti.getUid()) {
                                        if (!n.value.isInUidList(noti.getUid())) {
                                            processMerge(true);
                                        } else {
                                            processMerge(false);
                                        }
                                    }
                                    break;
                            }
                        } else if (n.value.canMerge() === 2) {
                            // no need to merge. delete older notification
                            if (n.value.getUid() === noti.getUid()) {
                                processMerge(false);
                            }
                        }
                    }

                }

                switch(json.actn) {
                    case OTYPES.TYPE_MY_NOTIFICATIONS:
                        if (json.sucs === true || json.sucs === 'true' ) {
                            var timeArray = [];

                            from_index += json.nList.length;
                            var oldNotiCount =  parseInt(Storage.getData('oldNotiCount'));
                            
                            if (oldNotiCount > json.tn) {
                                notiCounter = json.tn;
                                Storage.setData('oldNotiCount', 0);
                            } else {
                                notiCounter = json.tn - oldNotiCount;
                            }
                            
                            for(var i = 0; i < json.nList.length; i++) {
                                saveNewNoti = true;
                                noti = $$notiMap(json.nList[i]);
                                // check if merge needed and do the merge
                                $notification.all().forEach( mergeNoti);
                                timeArray.push(json.nList[i].ut);

                                var seenarr = Storage.getData('notiseen');
                                if (saveNewNoti) {
                                    for(var j = 0 ; j < seenarr.length ; j++ ){
                                        if( seenarr[j] === json.nList[i].id ){
                                            noti.updateSeenStatus(true);
                                        }
                                    }
                                    $notification.save(noti.getKey(), noti);
                                }
                                // URGENT. merging new notifications the notiCounter remains incorrect
                                //else {
                                    ////notiCounter = notiCounter > 0 ? notiCounter-1 : 0;
                                    //notiCounter = notiCounter > 1 ? notiCounter-1 : 0;
                                //}
                            }

                            var sortedTime = timeArray.sort();
                            minUpdateTime = sortedTime[0] || minUpdateTime;

                        } else if (json.sucs === false && json.rc === 1111) {
                            
                            loadMoreNoti();
                        } else {
                            state.noMoreData = true;
                            
                        }

                        break;
                    case OTYPES.TYPE_SINGLE_NOTIFICATION:
                        from_index++;
                        saveNewNoti = true;
                        noti = $$notiMap(json);
                        // check if merge needed and do the merge
                        $notification.all().forEach( mergeNoti);
                        if (saveNewNoti) {
                            $notification.save(noti.getKey(), noti);
                            //Storage.setData('oldNotiCount', parseInt(Storage.getData('oldNotiCount')) + 1);
                        }
                        notiCounter++; // will not effect oldNotiCount in localStorage

                        break;
                    default:
                }

			};



            var loadMoreNoti = function(toIndex) {
                toIndex = toIndex || 10;
                //var deferred = $q.defer();

                var obj = {
                    from_index: (from_index > 0) ? from_index : 0,
                    to_index: (from_index > 0) ? from_index+toIndex: toIndex,
                    scl: 2,
                    ut: minUpdateTime
                };

                notificationHttpService.requestNotification(obj);
                //.then(function(json) {
                    //if (json.sucs === true || json.sucs === 'true') {
                        //deferred.resolve();
                    //} else {
                        //deferred.reject();
                    //}
                //}, function(json) {
                    //if (json.sucs === false && json.rc === 1111) {
                        //loadMoreNoti(toIndex);
                    //} else {
                        //state.noMoreData = true;
                        //deferred.reject();
                    //}
                //});
                //return deferred.promise;
            };


            function init(force) {
                if (!initialized || force) {
                    initialized = true;
                    $$connector.subscribe(process,
                                  { action: [
                                        OTYPES.TYPE_MY_NOTIFICATIONS,
                                        OTYPES.TYPE_SINGLE_NOTIFICATION
                                    ]
                                  });

                    loadMoreNoti();
                }
            }


			return {
                init: init,
                state: state,
                loadMoreNoti: loadMoreNoti,
                process: process,
				getNotifications: function() {
					return $notification;
				},
				getNotification: function(key) {
					return $notification.get(key);
				},
				clearCounter: function() {
                    if (notiCounter > 0)  {
                        Storage.setData('oldNotiCount', notiCounter + parseInt(Storage.getData('oldNotiCount')) );
                        
                        notiCounter = 0;
                        // TODO BELOW CODE IS IMPORTANT. BUT REQURIES AUTH SERVER CHANGES FOR WEB TO WORK PROPERLY WITH CORRECT NEW NOTI COUNTER
						//notificationHttpService.clearNotiCount().then(function(json) {
                            //
                            //
                            //notiCounter = 0;
                        //});
                    }
                    // update notification times
                    //var notifications = NotificationFactory.getNotifications();
                        for(var i=0; i < $notification.length(); i++){
                            var timediff = Date.now() - $notification.all()[i].value.sortBy();
                            if(timediff < 3600000) {
                                $notification.all()[i].value.updateNotiTime();
                            }
                        }
				},
				getNotiCount: function() {
                    return  notiCounter > 99 ? '99+' : notiCounter;
				},
                //getNotificationDetails : function(obj) {
                    //var defer =  $q.defer();
                    //notificationHttpService.getNotificationDetails(obj).then(function(json){
                        //if(json.sucs ===true) {
                             //defer.resolve(json);
                        //}else{
                             //defer.reject(json);
                        //}

                    //});
                    //return defer.promise;
                //}

			};
		}

