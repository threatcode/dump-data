/*
 * © Ipvision
 */


    angular
            .module('ringid.global_directives')
            .service('rgDropdownService', rgDropdownService)
            .directive('rgDropdown', rgDropdown);


    rgDropdownService.$inject = ['GlobalEvents'];
    function rgDropdownService(GlobalEvents) { //jshint ignore:line
        var self = this, // jshint ignore:line
            _scope = false,
            _detachTemplate = false;



            function checkIfEscape (event) {
                var key = event.keyCode || event.which;
                if (key === 27) {
                    //handleDropdown();
                    self.close(event);
                }
            }

        function closeDropdown () {
            if(_scope && angular.isFunction(_scope.ddBeforeClose)){
                _scope.ddBeforeClose();
            }
            _detachTemplate();
            GlobalEvents.unbindHandler('document', 'click', self.close);
            GlobalEvents.unbindHandler('document', 'keydown', checkIfEscape);
        }

        function openDropdown () {
            _scope.ddOpened();
            GlobalEvents.bindHandler('document', 'click', self.close);
            GlobalEvents.bindHandler('document', 'keydown', checkIfEscape);
        }

        self.open = function open(detachTemplate, scope) {
            if (_detachTemplate) {
                closeDropdown();
            }
            _detachTemplate = detachTemplate;
            _scope = scope;
            openDropdown();
        };

        self.close = function close(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            if (_detachTemplate) {
                closeDropdown();
            }
            _detachTemplate = false;
            _scope = false;

        };

    }


    rgDropdown.$inject = ['$ringhttp', 'settings', '$compile', 'rgDropdownService', 'languageConstant', 'Utils', 'rgScrollbarService'];
    function rgDropdown($ringhttp, settings, $compile, rgDropdownService, languageConstant, Utils, rgScrollbarService) { //jshint ignore:line

        function linkFunc(scope, element) {
            var template,
                needHeightAdjust = true,
                adjustHeightTimeout,
                openDropdownEvent,
                dropdownMinHeight = 200,
                dropdownOriginalHeight = 0,
                templateHtml,
                dropdownOpen = false,
                onDropdown = false;

            scope.consType = languageConstant.get();

            function stopPropagation (event) {
                event.stopPropagation();
            }

            function handleDropdown(event) {
                if (!dropdownOpen) {
                    attachTemplate(event);
                    rgDropdownService.open(detachTemplate, scope);
                } else {
                    rgDropdownService.close();
                }
                stopPropagation(event);
            }

            function handleHover (event) {
                setTimeout(function() {
                    if (!onDropdown) {
                        RingLogger.information('NOT ON DROPDOWN', RingLogger.tags.DROPDOWN);
                        handleDropdown(event);
                    } else {
                        RingLogger.information('IS ON DROPDOWN', RingLogger.tags.DROPDOWN);
                    }
                }, 500);
            }



            element.on('click', handleDropdown);

            if( !scope.ddHtml && !scope.ddTemplate){
                RingLogger.error('Please set ddHtml for rg-dropdown.', RingLogger.tags.DROPDOWN);
            }else{
                if (scope.ddTemplate) {
                    //template = $compile(scope.ddTemplate)(scope);
                    templateHtml = scope.ddTemplate;
                } else {
                    //$ringhttp.get(settings.baseUrl + scope.ddHtml).success(function(response) {
                    $ringhttp.get(scope.ddHtml).success(function(response) {
                        //template = $compile(templateHtml)(scope);
                        templateHtml = response;
                    })
                    .error(function() {
                        RingLogger.warning('DROPDOWN TEMPLATE missing: ' + scope.ddHtml, RingLogger.tags.DROPDOWN);
                        scope.$rgDigest();
                    });
                }
            }



            function handleMouseEnter (event) {
                RingLogger.information('Mouse Enter', RingLogger.tags.DROPDOWN);
                onDropdown = true;
                element.off('mouseleave', handleHover);
            }

            function handleMouseLeave (event) {
                RingLogger.information('Mouse Leave', RingLogger.tags.DROPDOWN);
                onDropdown = false;
                handleHover(event);
                element.on('mouseleave', handleHover);
            }

            function attachTemplate(event) {
                RingLogger.information('DROPDOWN OPEN', RingLogger.tags.DROPDOWN);
                dropdownOpen = true;
                template = $compile(templateHtml)(scope);
                if (scope.ddControl && scope.ddControl.hasOwnProperty('append') && !scope.ddControl.append) {
                    element.after(template);
                } else {
                    element.append(template);
                }
                //stopPropagation
                for(var i = 0; i < template.length; i++) {
                    template[i].addEventListener('click', stopPropagation);
                }

                if (scope.ddControl && scope.ddControl.showOnHover) {
                    element[0].addEventListener('mouseleave', handleHover);

                    template[template.length-1].addEventListener('mouseenter', handleMouseEnter);
                    template[template.length-1].addEventListener('mouseleave', handleMouseLeave);

                }

                //if (needHeightAdjust) {
                    //openDropdownEvent = event;
                    //adjustHeight();
                    //window.addEventListener('resize', adjustHeight);
                //}

                scope.$rgDigest();

            }


            function adjustHeight() {
                if (!adjustHeightTimeout) {
                    adjustHeightTimeout = setTimeout(calculateHeight, 200);
                }
            }

            function calculateHeight() {
                adjustHeightTimeout = 0;
                //clearTimeout(adjustHeightTimeout);

                if (needHeightAdjust) {
                    var elemRect,
                        mainTemplate,
                        availHeight;

                    var totalHeight = 0, i, j;
                    for(i = 0; i < template.length; i++) {
                        if (!template[i].clientHeight) {
                            if (template[i].children) {
                                for(j = 0; j < template[i].children.length; j++) {
                                    if (template[i].children[j].clientHeight > 0) {
                                        mainTemplate = template[i].children[j];
                                        totalHeight += template[i].children[j].clientHeight;
                                        elemRect = template[i].children[j].getBoundingClientRect();
                                        availHeight = Utils.viewport.y - elemRect.height - elemRect.top;
                                        RingLogger.warning('GOT DROPDOWN height', RingLogger.tags.DROPDOWN);
                                    }
                                }

                            }
                        } else {
                            mainTemplate = template[i];
                            totalHeight += template[i].clientHeight;
                            elemRect = template[i].getBoundingClientRect();
                            availHeight = Utils.viewport.y - elemRect.height - elemRect.top;
                            RingLogger.warning('GOT DROPDOWN height', RingLogger.tags.DROPDOWN);
                        }
                    }


                    dropdownOriginalHeight = dropdownOriginalHeight > 0 ? dropdownOriginalHeight : totalHeight;


                    RingLogger.print(elemRect, RingLogger.tags.DROPDOWN);
                    RingLogger.information('Dropdown Height: ' + totalHeight, RingLogger.tags.DROPDOWN);
                    RingLogger.information('availHeight: ' + availHeight , RingLogger.tags.DROPDOWN);

                    // stop further height adjustsments when any particular dropdown orignal height is below minimum
                    if (dropdownOriginalHeight < dropdownMinHeight)  {
                        RingLogger.warning('NO NEED TO ADJUST SIZE', RingLogger.tags.DROPDOWN);
                        needHeightAdjust = false;
                        window.removeEventListener('resize', adjustHeight);
                        return;
                    }

                    if ((availHeight - 10) < 0) {
                         // need to reduce height of dropdown
                        var reducedHeight = totalHeight + availHeight - 10;
                        reducedHeight = reducedHeight > dropdownMinHeight ? reducedHeight : dropdownMinHeight;
                        RingLogger.information('REDUCED HEIGHT: ' + reducedHeight, RingLogger.tags.DROPDOWN);
                        mainTemplate.style.height = reducedHeight + 'px';
                        rgScrollbarService.recalculate(scope);
                        scope.$rgDigest();
                    }
                    else if ( totalHeight < dropdownOriginalHeight ) {
                        var increasedHeight = totalHeight + availHeight - 10;
                        increasedHeight = dropdownOriginalHeight > increasedHeight ? increasedHeight : dropdownOriginalHeight;
                        RingLogger.information('REDUCED HEIGHT: ' + increasedHeight, RingLogger.tags.DROPDOWN);
                        mainTemplate.style.height = increasedHeight + 'px';
                        rgScrollbarService.recalculate(scope);
                        scope.$rgDigest();
                    }

                }

            }


            function detachTemplate() {
                    var i;
                    //RingLogger.information('DROPDOWN CLOSE', RingLogger.tags.DROPDOWN);
                    dropdownOpen = false;

                    for(i = 0; i < template.length; i++) {
                        template[i].removeEventListener('click', stopPropagation);
                    }
                    if (scope.ddControl && scope.ddControl.showOnHover) {
                         element[0].removeEventListener('mouseleave', handleHover);
                         template[template.length-1].removeEventListener('mouseenter', handleMouseEnter);
                         template[template.length-1].removeEventListener('mouseleave', handleMouseLeave);
                    }
                    //template[template.length-1].parentNode.removeChild(template[template.length-1]);
                    // for(i = 0; i < template.length; i++) {
                    //     template[i].parentNode.removeChild(template[i]);
                    // }
                    //template[template.length-1].parentNode.removeChild(template);
                    template.remove();
                    //if (needHeightAdjust) {
                        //window.removeEventListener('resize', adjustHeight);
                    //}

                    scope.$parent.$rgDigest();
                //});
            }

            scope.$on('$destory', function() {
                element[0].removeEventListener('click', handleDropdown);
                detachTemplate();
            });


        }


        return {
            restrict: 'AE',
            link: linkFunc,
            scope: {
                ddHtml: '=',
                ddControl: '=',
                ddTemplate: '=',
                ddAction: '&',
                ddOpened: '&',
                ddBeforeClose: '&'
            }
        };
    }

