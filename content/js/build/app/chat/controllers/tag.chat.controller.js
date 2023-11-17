/*
 * © Ipvision
 */

    angular
        .module('ringid.chat')
        .controller('TagChatController', TagChatController);

    TagChatController.$inject = [
        '$scope', '$templateCache', '$timeout', 'settings',
        '$$connector',
        'Auth', 'Ringalert',
        'rgDropdownService', 'ChatFactory', 'Utils', 'tagChatStorage',
        'friendsFactory', 'tagChatFactory', 'tagChatManager',
        'chatRequestProcessor', 'ChatHelper', 'SystemEvents'];

    function TagChatController($scope, $templateCache, $timeout, settings,
                               $$connector,
                               Auth, Ringalert,
                               rgDropdownService, ChatFactory, Utils, tagChatStorage,
                               friendsFactory, tagChatFactory, tagChatManager,
                               chatRequestProcessor, ChatHelper, SystemEvents) {

        var viewModel = this;

        viewModel.memberDDHtml = 'templates/partials/tag-chat/member-actions-dropdown.html';//$templateCache.get('tag-chat-dropdown.html');
        viewModel.memberDDActions = memberDDActions;
        viewModel.getTagDDControl = getTagDDControl;

        viewModel.ready = false;

        viewModel.groupFilter = "groups";

        //try {
            //viewModel.debug = 
        //} catch (e) {
            viewModel.debug = false;
        //}


        var currentUser = Auth.currentUser();

        var CHAT_GLOBAL_VALUES = CHAT_APP.Constants.CHAT_GLOBAL_VALUES;


        viewModel.isCurrentUserOwner = function (tagObj) {
            return tagObj.getOwnerUserId() == currentUser.getKey();
        };

        viewModel.isCurrentUserMember = function (tagObj) {
            return tagObj.isUserMember(currentUser.getKey());
        };


        viewModel.allTags = tagChatFactory.getTags();

        viewModel.changeGroupFilter = function (filterName) {
            viewModel.groupFilter = filterName || 'groups';
        };

        viewModel.showGroupLogs = function (filterName) {
            return viewModel.groupFilter === 'logs';
        };

        viewModel.showGroups = function (filterName) {
            return viewModel.groupFilter === 'groups';
        };

        viewModel.getTagPictureImageByMemberAvatars = getTagPictureImageByMemberAvatars;
        viewModel.getLastMessageOnATag = getLastMessageOnATag;

        viewModel.imageBase = settings.imBase;

        viewModel.getUserAvatar = function (user) {
            if (!user || !user.avatar()) {
                return 'images/prof.png';
            } else {
                return user.avatar();
            }
        };

        viewModel.getLastMessageText = function (boxMessageObject) {

            if (boxMessageObject.messageType === 2) {
                return boxMessageObject.text;
            } else if ([6, 7, 8, 9].indexOf(boxMessageObject.messageType) !== -1) {
                return 'Media';
            }

            return false;
        };


        var restoreLocalData = function () {

            var packets = tagChatStorage.getAllPackets();
            var keys = Object.keys(packets);
            for (var index = 0; index < keys.length; index++) {
                if (packets.hasOwnProperty(keys[index])) {
                    var aPacket = packets[keys[index]];
                    tagChatSubscriber.processPacketData(Utils.string2ArrayBuffer(aPacket));
                }
            }
        };



        $scope.shouldShow = function () {
            return viewModel.ready;
        };


        $scope.showSingleMemberAlert = function(){

            Ringalert.show({'mg' : 'Please add a member before leaving the group.'}, 'info');

        };


       var tagListUpdatedFuncRef = Utils.onCustomEvent(SystemEvents.CHAT.TAG_LIST_UPDATED, function(){
            viewModel.allTags = tagChatFactory.getTags();
            viewModel.ready = true;
            Utils.safeDigest($scope);
        });



        $timeout(function () {
            viewModel.ready = true;
        }, 8000);

        // for listing

        function getTagDDControl(aTagObj) {
            return {

                tagId: aTagObj.getTagId(),
                isOwner: viewModel.isCurrentUserOwner(aTagObj)
            };

        }

        function getTagPictureImageByMemberAvatars(aTag) {
            var images = [];
            var allMembersObjects = aTag.getMembersObjectMap().all();
            var imageCount = 0;

            for (var index = 0; ( index < allMembersObjects.length && imageCount < 3); index++) {
                var aMemberObject = allMembersObjects[index].value;
                var pictureUrl = aMemberObject.getPictureUrl();
                if (pictureUrl !== '') {
                    images.push(pictureUrl);
                    imageCount++;
                }
            }

            return images;

        }

        function getLastMessageOnATag(aTag) {
            //var box = ChatFactory.getBoxByUId(aTag.getTagId());
            //if( !box || !box.messages.length){
            //	return false;
            //}

            var message = tagChatStorage.getLastMessageByTag(aTag.getTagId());
            if (!message) {
                return false;
            }

            //var message = box.messages[box.messages.length - 1];
            return message.value;
        }

        // edit, view or delete
        function memberDDActions(actionObj) {
            switch (actionObj.action) {
                case 'edit':
                case 'view':
                    rgDropdownService.close();

                    return function () {
                        return {tagId: actionObj.tagId};
                    };
                    break;
                case 'delete':

                    rgDropdownService.close();

                    var tagObject = tagChatFactory.getTag(actionObj.tagId);
                    tagObject.setObjectLock();
                    tagChatManager.leaveFromTag(actionObj.tagId, currentUser.getKey()).then(function (response) {

                        tagObject.removeObjectLock();
                        //Ringalert.show(response, 'info');
                        $scope.$rgDigest();

                    }, function (response) {

                        tagObject.removeObjectLock();
                        Ringalert.show(response, 'error');
                        $scope.$rgDigest();

                    });

                    $scope.$rgDigest();

                    break;
                default:
                    console.log('Err. no matching action');
            }
        }

        $scope.$on('$destroy', function(){
            Utils.removeCustomEventListener(SystemEvents.CHAT.TAG_LIST_UPDATED, tagListUpdatedFuncRef );
        });

    }


