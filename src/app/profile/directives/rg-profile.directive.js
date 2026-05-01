/*
 * © Ipvision
 */

    angular
        .module('ringid.profile')
        .directive('rgProfile', rgProfile);


        function rgProfile()  {

            ProfileController.$inject = ['$ringbox', '$scope', 'Notification', 'Storage', 'friendsFactory', '$routeParams', 'Auth', 'profileFactory', 'fileUploadService',
                'imageQuality', 'AlbumFactory', 'SystemEvents', 'Utils', 'Ringalert', 'languageConstant', '$rootScope', 'rgDropdownService', 'GlobalEvents'];
            function ProfileController ($ringbox, $scope, Notification, Storage, friendsFactory, $routeParams, Auth, profileFactory, fileUploadService,
                                          imageQuality, AlbumFactory, SystemEvents, Utils, Ringalert, languageConstant, $rootScope, rgDropdownService, GlobalEvents) {
                /* INITIALIZATION */
                $scope.viewport = Utils.viewport;
                var uId =  $routeParams.uId,
                    newCoverpic,
                    newPropic;

                $scope.isOwner = Auth.currentUser().getKey() === uId ? true : false;

                $scope.consType = languageConstant.get();

                $scope.profilePicDragEnable = false;
                $scope.coverPicDragEnable = false;

                $scope.processing = false;

                $scope.profileDdControl = {
                    showOnHover : true,
                    enableCoverReposition: true,
                    enableProfileReposition: true
                };
                $scope.showCoverDD = false; // show or hide cover setting dropdown
                $scope.coverPhotoStyle = {
                    "backgroundSize": "cover"
                };
                $scope.profilePhotoStyle = {
                    "backgroundSize": "cover"
                };

                $scope.link = Utils.getRingRoute('USER_PROFILE', { uId : uId});
                $scope.profileObj = profileFactory.getProfile(uId);
                if($scope.profileObj){//setting page title
                     RingLogger.print("Page title from profile change",RingLogger.tags.PAGETITLE);
                		Utils.setPageTitle($scope.profileObj.getName(),true);
				}

                if ($routeParams.subpage === undefined) {
                    //if ($scope.profileObj.isFriend() || $scope.profileObj.isCurrentUser()) {
                        $scope.subPage = 'post';
                    //} else {
                        //$scope.subPage = 'about';
                        //$scope.activeNav = 'basic';
                    //}
                } else {
                    $scope.subPage = $routeParams.subpage;
                    if ($scope.subPage === 'about') {
                        $scope.activeNav = 'basic';
                    }
                }
                $scope.subPageLink = 'templates/profile/profile.' + $scope.subPage + '.html';

                // get profile details
                profileFactory.init($scope.profileObj).then(function() {
                    updateStyle('coverphoto');
                    updateStyle('profilephoto');

                });


                var updateStyle = function(type) {
                    if (type === 'profilephoto') {
                        $scope.profilePhotoStyle.backgroundImage = "url(" + $scope.profileObj.avatar('thumb')  + ")";
                        $scope.profilePhotoStyle.backgroundPosition = '50% 50%';
                        if($scope.profilePhotoStyle.backgroundImage.indexOf('prof.png') > -1) {
                            $scope.profileDdControl.enableProfileReposition = false;
                        } else {
                            $scope.profileDdControl.enableProfileReposition = true;
                        }
                    } else {
                        $scope.coverPhotoStyle.backgroundImage = "url(" + $scope.profileObj.getCover()  + ")";
                        $scope.coverPhotoStyle.backgroundPosition = '0px 0px';
                        if($scope.coverPhotoStyle.backgroundImage.indexOf('default_cover') > -1) {
                            $scope.profileDdControl.enableCoverReposition = false;
                        } else {
                            $scope.profileDdControl.enableCoverReposition = true;
                        }
                    }
                    $scope.$rgDigest();
                };
                updateStyle('coverphoto');
                updateStyle('profilephoto');

                $scope.frndAction = function(actionObj) {
                    //actionObj.event.preventDefault();
                   rgDropdownService.close(actionObj.event);
                    if (!actionObj.friend.isLoading()) {
                        friendsFactory.friendAction(actionObj,true).then(function() {
                            $scope.$rgDigest();
                        }, function() {
                            $scope.$rgDigest();
                        });
                        $scope.$rgDigest();
                    }
                };
                /* END OF INITIALIZATION */


                /* cover photo dropdown */
                $scope.repositionExisting = false; // reposition existing pro pic or cover.

                $scope.coverDdHtml = 'templates/dropdowns/coverphoto-dropdown.html'; //$templateCache.get('coverphoto-dropdown.html');
                $scope.coverDdAction = function(actionObj) {
                    rgDropdownService.close(actionObj.event);
                    switch(actionObj.action) {
                        case 'coverphoto':
                            $scope.repositionExisting = false;
                            $scope.toggleResizeShow('coverphoto', true);
                            $scope.uploadAction(actionObj); // new cover photo selected
                            break;
                        case 'toggleReposition':
                            $scope.repositionExisting = true;
                            $scope.toggleResizeShow('coverphoto', true);

                            $scope.uploadAction({
                                action: 'coverphoto',
                                uploadFile: fileUploadService.queueFile('coverphoto', $scope.profileObj.getCover('original'))
                            });
                            break;
                        case 'popupData':
                            fileUploadService.uploadType = 'coverphoto';
                            return function() {
                                return {
                                    popupType: 'coverphoto'
                                };
                            };
                        default :
                            console.warn('Cover Photo Dropdown Action did not Match');
                    }
                    $scope.$rgDigest();
                };

                /* end cover photo dropdown */

                /* Profile photo Dropdown */

                $scope.profileDdHtml = 'templates/dropdowns/profilephoto-dropdown.html'; //$templateCache.get('profilephoto-dropdown.html');
                //$scope.frndActionHtml = 'templates/dropdowns/friend-settings-dropdown.html'; //$templateCache.get('profilephoto-dropdown.html');
                $scope.frndActionTemplate =
                    '<div class="action friend-settings-dropdown float-right">' +
                        '<a  ng-if="ddControl.friendshipStatus()==0 && !ddControl.isCurrentUser()" rg-click="ddAction()({ action: \'addfriend\', friend: ddControl, event:$event})" href="#"><span class="icon-addf pro-f"></span><span class="txt">{{consType.add_friend}}</span></a>' +
                        '<a  ng-if="ddControl.friendshipStatus()==1" rg-click="ddAction()({ action: \'unfriend\', friend: ddControl, event:$event})" href="#"> <span class="img_sprite w-h-13 icon-into-border f-Block"></span><span class="txt">{{consType.unfriend}}</span></a>' +
                        '<a  ng-if="ddControl.friendshipStatus()==2" rg-click="ddAction()({ action: \'accept\', friend: ddControl, event:$event})" href="#"><span class="icon-incoming pro-f"></span><span class="txt">{{consType.accept}}</span></a>' +
                        '<a  ng-if="ddControl.friendshipStatus()==3" rg-click="ddAction()({ action: \'remove\', friend: ddControl, event:$event})" href="#"><span class="friend-ico cancel-req"></span><span class="txt">'+'Cancel Request'+'</span></a>' +
                        '<a  ng-if="ddControl.isBlocked()===0 && !ddControl.isCurrentUser() && ddControl.friendshipStatus()==1" rg-click="ddAction()({ action: \'block\', friend: ddControl, event:$event})" href="#"><span class="img_sprite w-h-13 icon-block"></span><span class="txt">{{consType.block}}</span></a>' +
                        '<a  ng-if="ddControl.isBlocked()===1 && !ddControl.isCurrentUser() && ddControl.friendshipStatus()==1" rg-click="ddAction()({ action: \'unblock\', friend: ddControl, event:$event})" href="#"><span class="img_sprite w-h-13 icon-right f-Block"></span><span class="txt">{{consType.unblock}}</span></a>' +
                        '<a  ng-if="!ddControl.isCurrentUser()" rg-report spam-type="user" spam-id="ddControl.getKey()"><span class="report-ico"></span><span>Report</span></a>' +
                    '</div>';
                $scope.profileDdAction = function (actionObj) {
                    rgDropdownService.close(actionObj.event);
                    switch(actionObj.action) {
                        case 'profilephoto': // dropdown image selected for new profile photo
                            $scope.repositionExisting = false;
                            $scope.toggleResizeShow('profilephoto', true);
                            $scope.uploadAction(actionObj);
                            break;
                        case 'toggleReposition':
                            $scope.toggleResizeShow('profilephoto', true);
                            $scope.repositionExisting = true;

                            $scope.uploadAction({
                                action: 'profilephoto',
                                uploadFile: fileUploadService.queueFile('profilephoto', $scope.profileObj.avatar('original'))
                            });
                            break;
                        case 'popupData':
                            fileUploadService.uploadType = 'profilephoto';
                            return function() {
                                return {
                                    popupType: 'profilephoto'
                                };
                            };
                        default :
                            console.warn('Cover Photo Dropdown Action did not Match');
                    }
                    $scope.$rgDigest();
                };
                /* END Profile photo dropdown */

                $scope.toggleResizeShow = function(type, value) {
                    if(type === 'coverphoto') {
                        $scope.cvResizeProgressShow = value || false;
                    } else {
                        $scope.ppResizeProgressShow = value || false;
                    }
                    $scope.$rgDigest();
                };

                // photo selected from album for propic or coverpic
                $scope.$on(SystemEvents.IMAGE.DO_REPOSITION, function(event, args){
                    $scope.toggleResizeShow(fileUploadService.uploadType, true);
                    $scope.uploadAction({action: fileUploadService.uploadType, uploadFile: fileUploadService.queueFile(fileUploadService.uploadType, args.image)});
                    $ringbox.closeAll();
                });

                // cover photo, profile photo upload events handler
                $scope.uploadAction = function(actionObj) {
                    var fileToUpload;

                    if (actionObj.action === 'coverphoto') {
                        newCoverpic = actionObj.uploadFile;
                        fileToUpload = newCoverpic;
                    } else {
                        newPropic = actionObj.uploadFile;
                        fileToUpload = newPropic;
                    }

                    if (fileToUpload) {
                        $rootScope.$broadcast(SystemEvents.LOADING, true);
                        fileToUpload.fetchMeta(function(result) {
                            $rootScope.$broadcast(SystemEvents.LOADING, false);
                            if (result.success) {
                                if (actionObj.action === 'coverphoto') {
                                    $scope.toggleCoverPhotoReposition(fileToUpload.getPreview());
                                } else {
                                    $scope.toggleProfilePhotoReposition(fileToUpload.getPreview());
                                }
                            } else {
                                $scope.toggleResizeShow(actionObj.action, false);
                                Ringalert.show(result.message, 'error');
                            }
                            $scope.$rgDigest();
                        });
                    }
                    $scope.$rgDigest();
                };


                // set reposition and upload cover photo new/old
                $scope.uploadPicture = function(type,event) {
                    var fileToUpload;
                    if (type === 'coverphoto') {
                        $scope.cvUploadProgressShow = true;
                        $scope.coverPicDragEnable = false;
                        fileToUpload = newCoverpic;
                    } else if(type === 'profilephoto' ) {
                        $scope.ppUploadProgressShow = true;
                        $scope.profilePicDragEnable = false;
                        fileToUpload = newPropic;
                    }

                    $rootScope.$broadcast(SystemEvents.LOADING, true);
                    // upload file to image server and set cover or profile picture in auth server
                    //fileUploadService.uploadFile(type).then(function(response) {
                    fileToUpload.initUpload().then(function(response) {
                        $scope.cvUploadProgressShow = false;
                        $scope.ppUploadProgressShow = false;
                        if (response.sucs === true) {
                            if (type === 'profilephoto' ) {
                                profileFactory.changeProfilePicture(response).then(function() {
                                    $rootScope.$broadcast(SystemEvents.LOADING, false);
                                    $rootScope.$rgDigest();
                                    updateStyle(type);
                                });
                            } else if (type === 'coverphoto') {
                                profileFactory.changeCoverPicture(response).then(function() {
                                    $rootScope.$broadcast(SystemEvents.LOADING, false);
                                    $rootScope.$rgDigest();
                                    // in case of profile pic update localStorage
                                    updateStyle(type);
                                });
                            }

                        } else {
                            updateStyle(type);
                            $rootScope.$broadcast(SystemEvents.LOADING, false);
                        }

                    }, function(errorData) {
                        updateStyle(type);
                    });

                    if (event) {
                        event.stopPropagation();
                    }
                    $scope.$rgDigest();

                };


                // enable or disalbe cover pic reposition
                $scope.toggleCoverPhotoReposition = function (src, event) {
                    var originalSrc = '',
                        coverXY = $scope.profileObj.getCoverXY(),
                        imageFile;

                    if ($scope.coverPicDragEnable) {
                        $scope.coverPicDragEnable = false;
                        updateStyle('coverphoto');
                        //$scope.coverPhotoStyle.backgroundImage = "url(" + $scope.currentUser.getCover() + ")";
                    } else {
                        if (!src) {
                            src = $scope.profileObj.getCover();
                            imageFile = src.slice(src.lastIndexOf('/') + 1, src.length);
                            originalSrc = src.replace(imageFile, imageFile.replace('crp', '') );
                        } else {
                            originalSrc = src;
                        }

                        if ($scope.repositionExisting) {
                            $scope.coverPhotoStyle.backgroundPosition =  (-coverXY.x) + 'px ' + (-coverXY.y) + 'px';
                        } else {
                            $scope.coverPhotoStyle.backgroundPosition =  '0px 0px';
                        }
                        $scope.coverPhotoStyle.backgroundImage = "url(" + originalSrc + ")";

                        $scope.coverPicDragEnable = true;
                        $scope.$rgDigest();
                    }

                    if (event) {
                        event.stopPropagation();
                    }

                };

                $scope.$watch('profilePicDragEnable', function(newVal) {
                    if(! newVal && !$scope.ppUploadProgressShow) {
                        updateStyle('profilephoto');
                    }
                });

                $scope.$watch('coverPicDragEnable', function(newVal) {
                    if(!newVal && !$scope.cvUploadProgressShow) {
                        updateStyle('coverphoto');
                    }
                });



                // enable or disalbe cover pic reposition

                $scope.toggleProfilePhotoReposition = function (src,event) {
                    var originalSrc = '',
                        profileXY = $scope.profileObj.getAvatarXY(),
                        imageFile,
                        prefix;

                    if ($scope.profilePicDragEnable) {
                        $scope.profilePicDragEnable = false;
                        updateStyle('profilephoto');

                    } else {

                        if (!src) {
                            src = $scope.profileObj.avatar('original');
                            imageFile = src.slice(src.lastIndexOf('/') + 1, src.length);
                            originalSrc = src.replace(imageFile, imageFile.replace(prefix, '') );
                        } else {
                            originalSrc = src;
                        }

                        if ($scope.repositionExisting) {
                            $scope.profilePhotoStyle.backgroundPosition = (-profileXY.x) + 'px ' + (-profileXY.y) + 'px';
                        } else {
                            $scope.profilePhotoStyle.backgroundPosition = '0px 0px';
                        }

                        $scope.profilePhotoStyle.backgroundImage = "url(" + originalSrc + ")";
                        $scope.profilePicDragEnable = true;
                        $scope.$rgDigest();
                    }
                    if (event) {
                        event.stopPropagation();
                    }
                };


                $scope.getImageData = function (imageId) {
                    return {
                        data: function() {
                            return {
                                imgId: imageId
                            };
                        },
                        promise: AlbumFactory.getImageDetails(imageId)
                    };
                };


//--------------------------------- profile pic round-progress-bar (start) -------------
                $scope.cvUploadProgressShow = false;
                $scope.cvResizeProgressShow = false;
                $scope.ppResizeProgressShow = false;

                $scope.uploadStyle =  function() {
                    return {
                        width: fileUploadService.progress + '%'
                    };
                };

                $scope.roundProgressBarStyle = {
                    "dataRoundProgressWidth": "200",
                    "dataRoundProgressHeight": "200",
                    "dataRoundProgressOuterCircleWidth": "4",
                    "dataRoundProgressInnerCircleWidth": "8",
                    "dataRoundProgressOuterCircleRadius": "85",
                    "dataRoundProgressInnerCircleRadius": "85",
                    "dataRoundProgressLabelFont": '24',
                    "dataRoundProgressOuterCircleBackgroundColor": "#fff",
                    "dataRoundProgressOuterCircleForegroundColor": "#f47727",
                    "dataRoundProgressInnerCircleColor": "#fff",
                    "dataRoundProgressLabelColor": "#fff"
                };

                $scope.ppUploadProgressShow = false;
                $scope.uploadImageFileSize = function() {
                    return fileUploadService.currentUploadImageSize;
                };

                $scope.getRoundedProgressTextStyle = function(){
                    return {
                        'top': '50%',
                        'bottom': 'auto',
                        'left': '50%',
                        'transform': 'translateY(-50%) ' + 'translateX(-50%)',
                        'font-size': 100/3.5 + 'px',
                        'position' : 'absolute'
                    };
                };

                $scope.roundProgressData = function(){
                    return {
                        label: fileUploadService.progress + '%',
                        percentage: fileUploadService.progress,
                        dataLoaded : fileUploadService.dataLoaded
                    };
                };

                $scope.openRingbox = function(type){
                    if (type === 'cover') {
                        return !$scope.coverPicDragEnable && !$scope.cvResizeProgressShow && !$scope.cvUploadProgressShow && $scope.profileDdControl.enableCoverReposition;
                    } else {
                        return !$scope.profilePicDragEnable && !$scope.ppResizeProgressShow && !$scope.ppUploadProgressShow && $scope.profileDdControl.enableProfileReposition;
                    }
                };


                $scope.$on(SystemEvents.FILE_UPLOAD.PROGRESS_UPDATE, function(){
                    $scope.$rgDigest();
                });

                //profile about menu section for smaller device start
                $scope.showMenuItems = false;
                $scope.toggleMenuItem = function () {
                    $scope.showMenuItems = !$scope.showMenuItems;
                    $scope.$rgDigest();
                };
                $scope.closeDropdown = function () {
                    $scope.showMenuItems = false;
                    $scope.$rgDigest();
                };
                //profile about menu section for smaller device end

//--------------------------------- profile pic round-progress-bar (end) ---------------
                var resizeTimeout;
                function digestScope() {
                    if (!resizeTimeout) {
                        setTimeout(function() {
                            $scope.$rgDigest();
                            resizeTimeout = false;
                            //clearTimeout(resizeTimeout);
                        });
                    }
                }
                function activate() {
                    GlobalEvents.bindHandler('window', 'resize', digestScope);
                }
                activate();

                function deactivate() {
                    GlobalEvents.unbindHandler('window', 'resize', digestScope);
                    // remove all redundant data
                    if ($routeParams.subPage === 'about') {
                        // remove about data like education, skill etc
                        profileFactory.removeProfileData($scope.profileObj.getUtId());
                    }
                }

                $scope.$on('$destroy', deactivate);


            } // END CONTROLLER FUNC

            var linkFunc = function(scope, element) {
                function handleMouse(event) {
                    // event mouseenter=true, mouseleave=false
                    scope.showCoverDD = !scope.showCoverDD;
                    scope.$rgDigest();
                }

                element.on('mouseenter', handleMouse);
                element.on('mouseleave', handleMouse);

                scope.$on('$destroy', function() {
                    element.off('mouseenter', handleMouse);
                    element.off('mouseleave', handleMouse);
                });
            };

            return {
                restrict: 'E',
                scope: true,
                templateUrl: 'templates/profile/profile-header.html',
                controller: ProfileController,
                link: linkFunc
            };

        }
