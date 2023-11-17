/**
 * Created by mahbubul on 8/23/15.
 */
    var chatApp;

    try {
        chatApp = angular.module('ringid.chat');
    } catch (e) {}

    chatApp
        .directive('setTimeout', ['ChatFactory','$compile','$document', function (ChatFactory, $compile, $document) {
            return {
                restrict: 'EA',
                //replace: true,
                template: '<a><span class="img_sprite w-h-22px icon-timer-s"></span></a>',
                link: function (scope, element, attrs) {
                    //var showTimeout = false,
                    var timeoutBarCompiledDom,
                        openTimeoutPopup = function () {
                            scope.showTimeout = true;
                            scope.closeSettingPopup();
                            $document.bind('click', closeTimeoutPopup);

                            var timeoutBarDom = angular.element('<set-timeout-bar ></set-timeout-bar>');
                            timeoutBarCompiledDom = $compile(timeoutBarDom)(scope);
                            //element.append(timeoutBarCompiledDom);
                            //element.parent().parent().next().prepend(timeoutBarCompiledDom);
                            element.parent().parent().parent().next().prepend(timeoutBarCompiledDom);
                        },
                        closeTimeoutPopup = function () {
                            scope.showTimeout = false;
                            $document.unbind('click', closeTimeoutPopup);
                            if(timeoutBarCompiledDom)
                                timeoutBarCompiledDom.remove();
                        };
                    scope.closeTimeoutPopup = function () {
                        closeTimeoutPopup();
                    };
                    scope.showTimeout = false;

                    element.on('click', function (event) {
                        //console.log('cl');
                        console.dir(scope.showTimeout);
                        if (!scope.showTimeout) {
                            openTimeoutPopup();
                        } else {
                            closeTimeoutPopup();
                        }
                        event.stopPropagation();
                    });

                }
            }; // return object for directive factory function
        }])
        .directive('setTimeoutBar', ['ChatFactory','$compile', function (ChatFactory,$compile) {
            return {
                restrict: 'E',
                //replace: true,
                template:'<div class="timeout-area-with-popup"><div class="timeoutDivnew">\n\
<span class="enable-secret-chat">Enable Secret Chat:</span><div class="switchnew"><input class="float-left" ng-model="box.value.secretChat" type="checkbox"><label><i></i></label></div>\n\
<a href="#" ng-click="cancel($event)" ng-disabled="!box.value.secretChat" class="img_sprite w-h-22px correct-sec icon-close-b"></a>\n\
<a href="#" ng-click="showValueBox($event)" class="img_sprite timeout-sec icon-time"><p>sec</p><span>{{ timeout>4 ? timeout : 5}}</span></a></div></div>',
//<a href="#" ng-click="done($event)" ng-disabled="!box.value.secretChat" class="correct-icon-sec"></a>\n\
//<input class="timer-c" type="number" value="17" min="1" max="300" step="1" ng-model="timeout" ng-disabled="!box.value.secretChat" />\n\
//<br/>\n\
//<input class="btn-timer" type="button" ng-click="done($event)" value="Done" ng-disabled="!box.value.secretChat" />\n\
//<input class="btn-timer float-right" type="button" ng-click="cancel($event)" ng-disabled="!box.value.secretChat" value="Cancel"/>\n\
//</div>',
                link: function (scope, element, attrs) {
                    var timeoutVarriable = 0;
                    var timeoutVaueCompiledDom;

                    //element.on('keyup', function (event) {
                    //    scope.box.value.timeout = scope.timeout;
                    //});
                    scope.timeout = scope.box.value.timeout;
                    scope.showTimeoutBox = false;
                    //scope.secretChat = scope.box.value.secretChat;
                    //scope.box.value.secretChat = scope.secretChat;

                    //scope.done = function ($event) {
                    //    if(scope.timeout)
                    //        timeoutVarriable = parseInt(scope.timeout);
                    //    scope.box.value.timeout = timeoutVarriable;
                    //    //scope.box.value.secretChat = scope.secretChat;
                    //    //console.dir(scope.box.value.secretChat);
                    //    scope.closeTimeoutPopup();
                    //    //scope.showTimeout = true;
                    //    //element.remove();
                    //    //scope.$digest();
                    //    //scope.closeTimeoutPopup();
                    //    //element.remove();
                    //    if(!!$event)
                    //        $event.stopPropagation();
                    //};
                    scope.cancel = function ($event) {
                        //scope.box.value.timeout = 0;
                        //alert('cancel:'+scope.box.value.getKey())
                        scope.closeTimeoutPopup();
                        if(!!$event){
                            $event.preventDefault();
                            $event.stopPropagation();
                        }
                    };
                    scope.showValueBox = function ($event) {
                        if (!scope.showTimeoutBox) {
                            scope.showTimeoutBox = true;
                            var timeoutValueDom = angular.element('<set-timeout-Value ></set-timeout-Value>');
                            timeoutVaueCompiledDom = $compile(timeoutValueDom)(scope);
                            element.children(0).append(timeoutVaueCompiledDom);
                        } else{
                            scope.hideValueBox();
                        }

                        if(!!$event){
                            $event.preventDefault();
                            $event.stopPropagation();
                        }
                    };
                    scope.hideValueBox = function($event){
                        scope.showTimeoutBox = false;
                        if(timeoutVaueCompiledDom)
                            timeoutVaueCompiledDom.remove();
                        if(!!$event){
                            $event.preventDefault();
                            $event.stopPropagation();
                        }

                    };
                    element.on('click', function (event) {
                        //event.preventDefault();
                        event.stopPropagation();
                    });
                    //element.on('click', function (event) {
                    //    scope.showTimeout = false;
                    //    console.log('r:' + scope.showTimeout);
                    //    event.stopPropagation();
                    //});

                }
            }; // return object for directive factory function
        }])
        .directive('setTimeoutValue', ['ChatFactory', function (ChatFactory) {
            return {
                restrict: 'EA',
                templateUrl: 'templates/partials/chat-timeout-value-box.html',
                link: function (scope, element, attrs) {
                    //element.on('click', function (event) {
                    //    //console.log('cl');
                    //    if (!scope.showTimeout) {
                    //        openTimeoutPopup();
                    //    } else {
                    //        closeTimeoutPopup();
                    //    }
                    //    event.stopPropagation();
                    //});
                    scope.selectTimeout = function ($event, time) {
                        scope.box.value.timeout = scope.timeout = time;
                        scope.hideValueBox($event);
                        //scope.$digest();
                    }
                }
            }; // return object for directive factory function
        }])
        ;
