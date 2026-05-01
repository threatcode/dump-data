/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
 * * Copyright : Ipvision
 * _._._._._._._._._._._._._._._._._._._._._.*/


    angular
            .module('ringid.shared')
            .service('rgHashtagService', rgHashtagService)
            .directive('rgHashtag', rgHashtag);


		rgHashtagService.$inject = ['GlobalEvents'];
		function rgHashtagService(GlobalEvents) {
			var self = this, // jshint ignore:line
                _scope = false,
                _template = false;

			self.close= function(clearInput) {
                RingLogger.information('CLOSE HASHTAG DROPDOWN', RingLogger.tags.MEDIA);
                if (_template) {
                    _template.style.display = 'none';
                    _scope.resetTag(clearInput);
                    _scope.$rgDigest();
                    _template = false;
                    _scope = false;

                    GlobalEvents.unbindHandler('document', 'click', self.close);
                }
			};
			self.open= function(template, scope) {
                _template = template;
                _scope = scope;
                _template.style.display = 'block';
                GlobalEvents.bindHandler('document', 'click', self.close);
			};

		}

    rgHashtag.$inject = ['$compile', 'fileUploadService', 'Media', 'rgHashtagService', 'SystemEvents', '$rootScope', 'rgScrollbarService'];
    function rgHashtag($compile, fileUploadService, Media, rgHashtagService, SystemEvents, $rootScope, rgScrollbarService) { // jshint ignore:line


        var linkFunc = function(scope, element) {

            var tagDropdownElement,
                searchParam,
                hashTagTimeout,
                tagInputElement;

            scope.selectedTag = -1;
            // add hashtag
            scope.tagList = fileUploadService.tagList;
            scope.tagSuggestions = [];
            scope.tagLoading = false;
            tagInputElement = element[0].parentNode.querySelector('textarea#add-hashtag');
            tagDropdownElement = element[0].parentNode.querySelector('div#hashtag-dropdown');
            tagInputElement.addEventListener('keyup', handleHashTag);
            tagInputElement.addEventListener('keydown', handleEnter);

            scope.removeTag = function(event, index) {
                event.preventDefault();
                RingLogger.information('remove tag index: ' + index, RingLogger.tags.UPLOAD);
                fileUploadService.tagList.splice(index, 1);
                //if (scope.tagList.length === 0) {
                //tagDropdownElement.style.display = 'none';
                //}

                scope.$rgDigest();
            };


            scope.addHashTag = function(tag) {
                scope.tagList.push(tag);
                rgHashtagService.close(true);
            };


            scope.resetTag = function (clearInput) {
                fileUploadService.tagSuggestions = [];
                scope.selectedTag = -1;
                if (clearInput) {
                    tagInputElement.value =  '';
                }
                scope.$rgDigest();
            };

            scope.gotMedias = function() {
                return fileUploadService.audioFiles.length > 0 ||  fileUploadService.videoFiles.length > 0;
            };


            scope.$on(SystemEvents.FILE_UPLOAD.UPLOADS_POSTED, function() {
                scope.tagList = [];
                scope.resetTag(true);
            });

            function selectTag(moveUp) {
                if (moveUp) {
                    scope.selectedTag = scope.selectedTag <= 0 ? 0 : scope.selectedTag - 1;
                } else {
                    scope.selectedTag = scope.selectedTag+1 >= scope.tagSuggestions.length ? scope.tagSuggestions.length - 1: scope.selectedTag + 1;
                }
                if (scope.selectedTag >= 0) {
                    tagInputElement.value = scope.tagSuggestions[scope.selectedTag].sk;
                }
                RingLogger.information('MOVED TO SELECTION: ' + scope.selectedTag, RingLogger.tags.MEDIA);
                RingLogger.information('scroll to : ' + (scope.selectedTag / scope.tagSuggestions.length * 100), RingLogger.tags.MEDIA);
                rgScrollbarService.scrollTo(scope, (scope.selectedTag / scope.tagSuggestions.length * 100));
                scope.$rgDigest();

            }


            function handleEnter(event) {
                var key = event.keyCode || event.which,
                    tagValue = tagInputElement.value.trim();

                if (key === 27 || key === 13 || key === 10) {
                    event.preventDefault();
                    event.stopPropagation();

                    if (tagValue.length > 0) {
                        if (scope.selectedTag > -1) {
                            scope.addHashTag(scope.tagSuggestions[scope.selectedTag]);
                        } else {
                            // add hashtag
                            scope.addHashTag({
                                sk: tagValue,
                                ukey: 0
                            });
                        }
                        rgHashtagService.close();
                        scope.tagLoading = false;
                    } else {
                        tagInputElement.value = '';
                    }
                }
            }


            function handleHashTag(event) {
                var key = event.keyCode || event.which,
                    tagValue = tagInputElement.value.trim();

                if (key === 38 && tagValue.length > 0) { // up key
                    // move tag selection up
                    selectTag(true);
                } else if (key === 40 && tagValue.length > 0) {
                    // move tag selection down
                    selectTag(false);
                } else if (key === 27 || key === 13 || key === 10) {
                    RingLogger.information('ENTER pressed. add HashTag', RingLogger.tags.MEDIA);
                    // escape or enter pressed. add hashtag
                    event.preventDefault();
                    //if (tagValue.length > 0) {
                        //if (scope.selectedTag > -1) {
                            //scope.addHashTag(scope.tagSuggestions[scope.selectedTag]);
                        //} else {
                            //// add hashtag
                            //scope.addHashTag({
                                //sk: tagValue,
                                //ukey: 0
                            //});
                        //}
                        //rgHashtagService.close();
                        //scope.tagLoading = false;
                    //} else {
                        //tagInputElement.value = '';
                    //}
                } else if (tagValue.length > 0) {
                    RingLogger.information('Search Param :' + tagValue, RingLogger.tags.MEDIA);
                    //fetchTags();
                    //clearTimeout(hashTagTimeout);
                    hashTagTimeout = setTimeout(fetchTags, 200);
                } else if (tagValue.length === 0) {
                    RingLogger.information('Search Param empty', RingLogger.tags.MEDIA);
                    clearTimeout(hashTagTimeout);
                    rgHashtagService.close();
                }
                scope.$rgDigest();
            }

            function fetchTags() {
                var tagValue = tagInputElement.value.trim();
                // pull tag suggestion and show in dropdown
                if (tagValue.length > 0 && searchParam !== tagValue) {
                    rgHashtagService.open(tagDropdownElement, scope);
                    searchParam = tagValue;
                    scope.tagLoading = true;
                    scope.selectedTag = -1;
                    scope.tagSuggestions = [];
                    RingLogger.information('Searching for :' + tagValue, RingLogger.tags.MEDIA);
                    Media.fetchHashtagSuggestion(tagValue).then(function(json) {
                        if (scope.tagLoading) {
                            clearTimeout(hashTagTimeout);
                            scope.tagLoading = false;
                            RingLogger.information('HASH TAG SUGGESTION');
                            RingLogger.print(json, RingLogger.tags.UPLOAD);
                            if (json.sucs === true) {
                                scope.tagSuggestions = json.sgstn;
                            } else {
                                rgHashtagService.close();
                            }
                            scope.$rgDigest();
                        }
                    });

                } else {
                    clearTimeout(hashTagTimeout);
                }
                scope.$rgDigest();
            }


            scope.$on('$destroy', function() {
                tagInputElement.removeEventListener('keyup', handleHashTag);
                tagInputElement.removeEventListener('keypress', handleEnter);
            });




        };  // LINK function END

        return {
            restrict: 'E',
            link: linkFunc,
            template:
                    '<div ng-show="gotMedias()">' +
                        '<div >' +
                            '<ul class="tag-fnd-lst">' +
                                '<li ng-repeat="tag in tagList" ><span class="tag-title" ng-bind="tag.sk" ></span>&nbsp;<span class="tag-cros" rg-click="removeTag($event, $index)">X</span></li>' +
                            '</ul>' +
                        '</div>'+
                    '</div>' +
                    '<div  ng-show="ddControl.uploadWhat !== \'image\' && getMedia(true).length > 0"  class="b-t-b"><span class="top-r float-left" data-tool="Type something for tags suggestion OR press enter to add new tag"><i class="p-10 img_sprite view-ico" style="margin:7px;padding:0;"></i></span><textarea id="add-hashtag" ng-model="tagName" type="text"  class="media-tags float-left"  placeholder="Add Hashtag" ></textarea><div class="clear"></div></div>' +
                    '<div id="hashtag-dropdown" class="m-s-height tag-dd active" style="display:none;">' +
                        '<div class="loader-s" ng-show="tagLoading">' +
                            '<div class="lr1"></div>' +
                            '<div class="lr2"></div>' +
                            '<div class="lr3"></div>' +
                        '</div>' +
                            '<ul class="m-s-result" rg-scrollbar="true" style="overflow: hidden;">' +
                                '<li ng-repeat="tag in tagSuggestions track by tag.ukey" ng-class="{active:$index==selectedTag}"  class="m-t-icon" rg-click="addHashTag({sk: tag.sk, ukey: tag.ukey})">' +
                                    '<a href="javascript:void(0)" title="{{tag.sk}}" ng-bind="tag.sk" > abc</a>' +
                                '</li>' +
                            '</ul>' +
                    '</div>'
        };
    }

