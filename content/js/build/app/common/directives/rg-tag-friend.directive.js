    angular.module('ringid.directives')
            .directive('rgTagFriend', rgTagFriend);
            // .filter('userListFilter', userListFilter)
            // .directive('rgTagFriendDropdown', rgTagFriendDropdown);

        // function userListFilter() {
        //         return function(items, name, tagItems) {
        //             if (items) {
        //                 var filtered = [], tempu;
        //                 var nameMatch = new RegExp(name, 'i');
        //                 for (var i = 0; i < items.length; i++) {
        //                     if (filtered.length > 10)
        //                         return filtered;
        //                     tempu = items[i].value.getLiteUser();
        //                     if (nameMatch.test(tempu.getName()) && tagItems.indexOf(tempu) === -1) {
        //                         filtered.push(tempu);
        //                     }
        //                 }
        //                 return filtered;
        //             }
        //         };
        //     }
    rgTagFriend.$inject = ['$compile', '$document'];
    function rgTagFriend($compile, $document) {
      return {
            restrict : 'A',
            scope : {
                onSelect : '&',
                tagItems : '='
            },
            //template : '',
            //controller : controllerFn,
            link : function(scope,element,attr){
                  if(attr.rgTagFriend === "false"){
                    element.parent().remove();
                    return;
                  }
                var DropdownElement;
                scope.active=false;
                scope.filterText = "";
                scope.init = function(display, event) {
                    if (!DropdownElement) {
                        DropdownElement = $compile('<rg-friend-dropdown tag-items="tagItems" filter-text="filterText" focus-filter="active" on-close="close" on-select="choose"></rg-friend-dropdown>')(scope);
                        element.after(DropdownElement);
                        //DropdownElement.css({
                        //    top : (event.pageY+10) +'px',
                        //    left : (event.pageX+10) + 'px'
                        //});
                       // DropdownElement.on('keydown',processKeyup);
                    };

                    scope.active = true;
                };
                scope.choose = function(subCat, $event) {
                    scope.onSelect({item: subCat});
                    scope.filterText = "";
                    if(scope.$parent && scope.$parent.$id !==1){
                        scope.$parent.$rgDigest();
                    }else{
                        $scope.$rgDigest();
                    }
                    // scope.FilterText = "";
                    //  scope.init("none",$event);
                    //scope.active = false;
                    //document on lick will close the box so no need to close
                };
                // scope.$watch('showWhen',function(newVal){
                //     var display = 'none';
                //     if(newVal){
                //         display = 'block';
                //         scope.init(display);
                //     }
                //     //element.css('display',display);
                //});

                function bindFn(event) {
                    event.preventDefault();
                    //event.stopPropagation();
                    if (scope.active) {
                        scope.close(event);
                        $document.off("click", bindDocumentClicktoControlClose);
                    } else {
                        scope.init(event);
                        $document.on("click", bindDocumentClicktoControlClose);
                    }

                }
                function bindDocumentClicktoControlClose (e) {
                    if (e.target != element[0] && e.target.parentNode != element[0] && e.target.parentNode !=null && e.target.parentNode.parentNode != element[0] && e.target.className != 'pt-top') {
                        scope.close(e);
                    }

                }
                element.on("click", bindFn);


                scope.close = function(event) {
                    if (scope.active) {
                        DropdownElement.off("keydown");
                        DropdownElement.remove();
                        DropdownElement = undefined;
                        scope.active = false;
                    }
                }


                // function processKeyup(e){
                //      var keyCode = e.which || e.keyCode || e.key;
                //     if(keyCode === 38 || keyCode === 40){
                //         e.preventDefault();e.stopPropagation();
                //           DropdownElement.triggerHandler(e,keyCode);
                //         return;
                //     }else if(keyCode === 13){
                //         e.stopPropagation();e.preventDefault();
                //         DropdownElement.triggerHandler(e,keyCode);
                //     }
                // }
                // ####
                scope.$on("$destroy", function() {
                    element.off("click",bindFn);
                    $document.off("click",bindDocumentClicktoControlClose);
                    if(DropdownElement){
                        //DropdownElement.off("keydown");
                        DropdownElement = undefined;
                    }

                });

            }
            // template : 'templates/common/emotion-dropdown.html'
        }
    }

