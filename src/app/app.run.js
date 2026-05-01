/*
 * © Ipvision
 */
//window.WebSocket = null;
//window.onbeforeunload = function (e) {
//	return "Are you sure you want to navigate away from this page";
//};
    var app;
    app = angular
        .module('ringid')
        .run(['$rootScope', '$window', '$document','$$connector', '$ringhttp', 'settings', function ($rootScope, $window, $document,$$connector, $ringhttp, settings) {
            //$http.defaults.headers.common['x-app-version']= settings.apiVersion;
           // $$connector.init();
            var windowElement = angular.element($window),
                vendorPrefix, prevEvent;
                $$connector.init();
                function activeTab(event){
                    if (prevEvent !== 'inactive') {
                        $rootScope.$broadcast('ringInactive', event);
                    }
                    prevEvent = 'inactive';
                }
            function inactiveTab(event) {
                if (prevEvent !== 'active') {
                    $rootScope.$broadcast('ringActive', event);
                }
                prevEvent = 'active';
            }
            windowElement.on('inactive',activeTab);

            windowElement.on('active', inactiveTab);
            //console.log(languageLoader.get('default'));
            //$rootScope.__ = function (key,lang){
            //    return languageLoader.get(key);
            //};


            function windowVisibilityChangeHandler(event) {
                if (this[vendorPrefix ? vendorPrefix + 'Hidden' : 'hidden'] && prevEvent !== 'inactive') {
                    $rootScope.$broadcast('ringInactive', event);
                    prevEvent = 'inactive';
                } else if (prevEvent !== 'active') {
                    $rootScope.$broadcast('ringActive', event);
                    prevEvent = 'active';
                }

            }

            if ('hidden' in $document) {
                vendorPrefix = '';
            } else {
                angular.forEach(['moz', 'webkit', 'ms'], function (prefix) {
                    if ((prefix + 'Hidden') in $document[0]) {
                        vendorPrefix = prefix;
                    }
                });
            }
            if (angular.isDefined(vendorPrefix) && vendorPrefix !== '') {
                $document[0].addEventListener(vendorPrefix + 'visibilitychange', windowVisibilityChangeHandler);
            }


            // NEED TO ENABLE LATER WHEN SERVER RESPONSE IS CORRECT
            $ringhttp.get(settings.constantServer).success(function(json){
                var ob = angular.fromJson(json);
                if (ob.sucs === true) {
                    settings.updateUrlBase(ob);
                }
                ob = null;
            });


            // SOCIAL LOGIN SIGNUP
            //$window.fbAsyncInit = function() {
              //FB.init({
                //appId      : settings.fbAppId,
                //cookie     : true,  // enable cookies to allow the server to access
                                    //// the session
                //xfbml      : true,  // parse social plugins on this page
                //version    : 'v2.2' // use version 2.2
              //});
            //};


            //// Load the SDK asynchronously
            //(function(d, s, id) {
                //var js, fjs = d.getElementsByTagName(s)[0];
                //if (d.getElementById(id)) { return;}
                //js = d.createElement(s); js.id = id;
                //js.src = "//connect.facebook.net/en_US/sdk.js";
                //fjs.parentNode.insertBefore(js, fjs);
            //}(document, 'script', 'facebook-jssdk'));

        }]);

