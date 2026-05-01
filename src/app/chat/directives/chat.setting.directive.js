/**
 * Created by mahbubul on 2/4/16.
 */
/**
 * Created by mahbubul on 8/23/15.
 */
    var chatApp;

    try {
        chatApp = angular.module('ringid.chat');
    } catch (e) {
    }
    chatApp
        .directive('setting', ['ChatFactory','$compile','$document', function (ChatFactory, $compile, $document) {
            return {
                restrict: 'EA',
                //replace: true,
                template: '<a><span class="img_sprite icon-g-settings"></span></a>',
                link: function (scope, element, attrs) {
                    //var showTimeout = false,
                    var settingBarCompiledDom,
                        openSettingPopup = function () {
                            scope.showSetting = true;
                            scope.closeTimeoutPopup();
                            $document.bind('click', closeSettingPopup);

                            var settingBarDom = angular.element('<setting-bar ></setting-bar>');
                            settingBarCompiledDom = $compile(settingBarDom)(scope);
                            //element.append(timeoutBarCompiledDom);
                            //element.parent().parent().next().prepend(timeoutBarCompiledDom);
                            element.parent().parent().parent().next().prepend(settingBarCompiledDom);
                        },
                        closeSettingPopup = function () {
                            scope.showSetting = false;
                            $document.unbind('click', closeSettingPopup);
                            if(settingBarCompiledDom)
                                settingBarCompiledDom.remove();
                        };
                    scope.closeSettingPopup = function () {
                        closeSettingPopup();
                    };
                    scope.showSetting = false;

                    element.on('click', function (event) {
                        //console.log('cl');
                        console.dir(scope.showSetting);
                        if (!scope.showSetting) {
                            openSettingPopup();
                        } else {
                            closeSettingPopup();
                        }
                        event.stopPropagation();
                    });

                }
            }; // return object for directive factory function
        }])
        .directive('settingBar', ['ChatFactory', '$compile', 'profileFactory', 'tagChatFactory', 'ChatUtilsFactory', 'Auth', 'ChatConnector',   'PLATFORM', 'Ringalert',
            function (ChatFactory, $compile, profileFactory, tagChatFactory, ChatUtilsFactory, Auth, ChatConnector,   PLATFORM, Ringalert ) {
            return {
                restrict: 'E',
                //replace: true,
                //<span class="enable-block">Block:</span><div class="switch-enable-block"><input class="float-left" ng-model="box.value.blocked" type="checkbox"><label><i></i></label></div>\n\
                template:'<div class="timeout-area-with-popup"><div class="timeoutDivnew">\n\
<span class="secret-visible">Timer:</span><div class="switch-secret-visible"><input class="float-left" ng-model="box.value.isSecretVisible" type="checkbox"><label><i></i></label></div>\n\
<a href="#" ng-click="cancel($event)" ng-disabled="!box.value.secretChat" class="img_sprite w-h-22px correct-sec icon-close-b"></a>\n\
</div></div>',
//<a href="#" ng-click="done($event)" ng-disabled="!box.value.secretChat" class="correct-icon-sec"></a>\n\
//<input class="timer-c" type="number" value="17" min="1" max="300" step="1" ng-model="timeout" ng-disabled="!box.value.secretChat" />\n\
//<br/>\n\
//<input class="btn-timer" type="button" ng-click="done($event)" value="Done" ng-disabled="!box.value.secretChat" />\n\
//<input class="btn-timer float-right" type="button" ng-click="cancel($event)" ng-disabled="!box.value.secretChat" value="Cancel"/>\n\
//</div>',

//FOLLOWING LINE NEED TO BE ADDED WHILE BLOCK/UNBLOCK WILL BE ADDED
//<span class="enable-block" ng-show="box.value.getUser().friendshipStatus()==1">Block:</span><div ng-show="box.value.getUser().friendshipStatus()==1" class="switch-enable-block"><input ng-click="blockUnblock($event)" class="float-left" ng-model="box.value.blocked" type="checkbox"><label><i></i></label></div>\n\
                link: function (scope, element, attrs) {
                    var SharedHelpers = CHAT_APP.SharedHelpers;
                    var getUUIDPacketId = CHAT_APP.UTILS.getUUIDPacketId;
                    var currentUserObject = Auth.currentUser();
                    var currentUserUtId = currentUserObject.getUtId();
                    var checkBlockedByUtIdExists = function (utId) {
                        if(scope.box.value.blockedByUtId && scope.box.value.blockedByUtId.length > 0){
                            var flag = 0;
                            for(var iterator = 0, iteratorLimit = scope.box.value.blockedByUtId.length; iterator < iteratorLimit; iterator++ ){
                                if( scope.box.value.blockedByUtId[iterator] == utId){
                                    flag = 1;
                                }
                            }
                            if( flag == 1){
                                return true;
                            } else{
                                return false;
                            }
                        }else{
                            return false;
                        }
                    };
                    var removeBlockedUtId = function (utId){
                        var index =  scope.box.value.blockedByUtId.indexOf(utId);
                        if (index > -1) {
                            scope.box.value.blockedByUtId.splice(index, 1);
                        }
                    };
                    var sendBlockUnblockToAuthServer = function(forceFlag){//if forceFlag true parameter is passed then we have to give this priority and ignore scope.box.value.blocked value
                        var blockedFlag = scope.box.value.blocked ? 0 : 1; // sv = 0:blocked and sv=1:nonBlocked
                        if(forceFlag){
                            blockedFlag = 1;
                        }
                        var blockObjectAuth = {
                            actn        : 82,                                   // another was 216, but 216 is obsolete, 82 will be for me
                            sv          : blockedFlag,                          // value to be sent for blocking to auth server
                            sn          : 7,                                    // 7 for chat
                            utId        : scope.box.value.getUser().getUtId(),  // utId from userObject
                            isCurrent   : false                                 // in this case not currentUser
                        };
                        profileFactory.saveChatPvcEdit(blockObjectAuth).then(function(data){
                            if(data.sucs === true){
                                //$scope.fPrivacyInfo.chatPrivacy = fPrivacyInfo.chatPrivacy;
                                RingLogger.print("chatPrivacy"+data,RingLogger.tags.CHAT);
                            }else{
                                RingLogger.print("chatPrivacy"+data,RingLogger.tags.CHAT);
                                //$scope.fPrivacyInfo.chatPrivacy = 0;
                            }
                        });
                    };
                    var sendBlockUnblockToChatServer = function(){
                        return true;
//                        if( !scope.box.value.checkWaitingTimePassed() && scope.box.value.hasIpPort() ){
//                            var currentServerTime = SharedHelpers.getChatServerCurrentTime();
//                            var packetId = getUUIDPacketId(currentServerTime);
//                            var blockUnblockObjectChat = { //                                ip                      : scope.box.value.getIp(),
//                                port                    : scope.box.value.getPort(),
//                                packetType              : scope.box.value.blocked ? 27 : 28,
//                                packetId                : packetId,
//                                userId                  : Auth.currentUser().getKey(),
//                                friendId                : scope.box.value.getKey(),
//                                //blockDate               : currentServerTime,
//                                isSecretVisible         : 1,//isSecretVisible instead of isAddToDb
//                                blockUnblockUpdateDate  : currentServerTime,
//                                platform                : PLATFORM.WEB
//                            };
//                            if(scope.box.value.blocked){
//                                var blockUnblockPacket = PacketDataParse.constructPacket(blockUnblockObjectChat, 27, CHAT_PACKET_FORMAT.FRIEND_BLOCK_PKT.FORMAT);
//                                var arrayBuffer = ArrayBuffer.prototype.slice.call( blockUnblockPacket.buffer, 6 );
//                                var parsedBlockObject = PacketDataParse.parsePacket(arrayBuffer, 27, CHAT_PACKET_FORMAT.FRIEND_BLOCK_PKT.FORMAT);
//                            }else{
//                                var blockUnblockPacket = PacketDataParse.constructPacket(blockUnblockObjectChat, 28, CHAT_PACKET_FORMAT.FRIEND_UNBLOCK_PKT.FORMAT);
//                                var arrayBuffer = ArrayBuffer.prototype.slice.call( blockUnblockPacket.buffer, 6 );
//                                var parsedBlockObject = PacketDataParse.parsePacket(arrayBuffer, 28, CHAT_PACKET_FORMAT.FRIEND_UNBLOCK_PKT.FORMAT);
//                            }
//                            //var arrayBuffer = ArrayBuffer.prototype.slice.call( blockUnblockPacket.buffer, 6 );
//                            //var parsedBlockObject = PacketDataParse.parsePacket(arrayBuffer, 27, CHAT_PACKET_FORMAT.FRIEND_BLOCK_PKT.FORMAT);
//                            console.log(parsedBlockObject);
//                            //ChatConnector.send(blockUnblockPacket);
//                        }
                    };
                    scope.cancel = function ($event) {
                        //scope.box.value.timeout = 0;
                        //alert('cancel:'+scope.box.value.getKey())
                        scope.closeSettingPopup();
                        if(!!$event){
                            $event.preventDefault();
                            $event.stopPropagation();
                        }
                    };
                    scope.blockUnblock = function($event){

//						if(!scope.box.value.blocked){
//
//                            if(scope.box.value.blockedByUtId){
//                                if(scope.box.value.blockedByUtId.length > 1 && checkBlockedByUtIdExists(currentUserUtId)){
//                                    scope.box.value.blocked = true;
//                                    Ringalert.show("You can't Unblock as your friend blocked you.", "warning");
//                                    sendBlockUnblockToAuthServer(true);
//                                    PullerSubscriber.requestForIp(scope.box.value.getKey());
//                                    removeBlockedUtId(currentUserUtId);
//
//                                } else if(scope.box.value.blockedByUtId.length == 1 && checkBlockedByUtIdExists(currentUserUtId)){
//                                    PullerSubscriber.requestForIp(scope.box.value.getKey());
//                                    sendBlockUnblockToAuthServer();
//                                    sendBlockUnblockToChatServer();
//                                    removeBlockedUtId(currentUserUtId);
//
//                                } else if(scope.box.value.blockedByUtId.length == 1 && !checkBlockedByUtIdExists(currentUserUtId)){
//                                    scope.box.value.blocked = true;
//                                    Ringalert.show("You can't Unblock as your friend blocked you.", "warning");
//
//                                } else if(scope.box.value.blockedByUtId.length == 0){
//                                    scope.box.value.blocked = true;
//                                    Ringalert.show("You can't Unblock as your friend blocked you.", "warning");
//                                }
//   		                      //  if(scope.box.value.blockedByUtId == currentUserUtId){
//       		                  //      // on this logical condition user will be able to unblock friend as he blocked him
//                                 //   sendBlockUnblockToAuthServer();
//                                 //   sendBlockUnblockToChatServer();
//                                 //   PullerSubscriber.requestForIp(scope.box.value.getKey());
//           		              //  }else{
//               		          //      // otherwise unblocking process will not proceed and ui will be get back to the previous state.
//                                 //   scope.box.value.blocked = true;
//                                 //   Ringalert.show("You can't Unblock as your friend blocked you.", "warning");
//                    	        //}
//                       		}// end of checking if it was previously blocked by himself or not
//                            else{
//                                //scope.box.value.blocked = true;
//                                //Ringalert.show("You can't Unblock as your friend blocked you.", "warning");
//                            }
//						}else {
//                            if(checkBlockedByUtIdExists(currentUserUtId)){
//
//                            }else{
//                                scope.box.value.blockedByUtId.push(currentUserUtId);
//                            }
//                            sendBlockUnblockToAuthServer();
//                            sendBlockUnblockToChatServer();
//                        }

                        //RingLogger.print("BLOCK/UNBLOCK: " + scope.box.value.blocked,RingLogger.tags.CHAT);

                        /* for sending the BLOCK/UNBLOCK to another tab */
                        //chatTabSync.sendData(CHAT_GENERAL_CONSTANTS.TAB_SYNC_ACTIONS.CHAT_BLOCK_UNBLOCK, {boxId : scope.box.value.getKey()});
                    };
                    element.on('click', function (event) {
                        //event.preventDefault();
                        event.stopPropagation();
                    });

                }
            }; // return object for directive factory function
        }])
    ;
