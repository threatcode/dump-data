/*
 * © Ipvision
 */

(function() {
	'use strict';

	angular
		.module('ringid.social')
        .factory('socialPopup', socialPopup);

        socialPopup.$inject = ['$$q', '$interval', '$window', 'socialConfig', 'socialUtils', 'utilsFactory'];
        function socialPopup ($q, $interval, $window, socialConfig, socialUtils, utilsFactory) { // jshint ignore:line
            var Popup = {};

            Popup.url = '';
            Popup.popupWindow = null;

            Popup.open = function(url, name, options) {
                Popup.url = url;

                var stringifiedOptions = Popup.stringifyOptions(Popup.prepareOptions(options));
                var UA = $window.navigator.userAgent;
                var windowName = (socialConfig.cordova || UA.indexOf('CriOS') > -1) ? '_blank' : name;

                Popup.popupWindow = $window.open(url, windowName, stringifiedOptions);

                $window.popup = Popup.popupWindow;

                if (Popup.popupWindow && Popup.popupWindow.focus) {
                    Popup.popupWindow.focus();
                }

                return Popup;
            };

            Popup.eventListener = function(redirectUri) {
                var deferred = $q.defer();

                Popup.popupWindow.addEventListener('loadstart', function(event) {
                    if (event.url.indexOf(redirectUri) !== 0) {
                        return;
                    }


                    var parser = document.createElement('a');
                    parser.href = event.url;

                    if (parser.search || parser.hash) {
                        var queryParams = parser.search.substring(1).replace(/\/$/, '');
                        var hashParams = parser.hash.substring(1).replace(/\/$/, '');
                        var hash = socialUtils.parseQueryString(hashParams);
                        var qs = socialUtils.parseQueryString(queryParams);

                        angular.extend(qs, hash);

                        if (!qs.error) {
                            deferred.resolve(qs);
                        }

                        Popup.popupWindow.close();
                    }
                });

                Popup.popupWindow.addEventListener('loaderror', function() {
                    deferred.reject({rc: 0, mg:'Error Loading Authorization URL'});
                });

                Popup.popupWindow.addEventListener('onbeforeunload' , function() {
                    deferred.reject({rc: 0, mg:'Popup closed unexpectedly'});
                });

                return deferred.promise;
            };

            Popup.pollPopup = function() {
                var deferred = $q.defer();

                var polling = $interval(function() {
                    try {
                        var documentOrigin = document.location.host;
                        var popupWindowOrigin = Popup.popupWindow.location.host;

                        if (popupWindowOrigin === documentOrigin  &&
                            (Popup.popupWindow.location.search ||
                            Popup.popupWindow.location.hash)) {

                            RingLogger.information('calback url: ' + Popup.popupWindow.location, RingLogger.tags.AUTH);

                            var queryParams = Popup.popupWindow.location.search.substring(1).replace(/\/$/, '');
                            var hashParams = Popup.popupWindow.location.hash.substring(1).replace(/[\/$]/, '');
                            var hash = socialUtils.parseQueryString(hashParams);
                            var qs = socialUtils.parseQueryString(queryParams);

                            angular.extend(qs, hash);

                            if (qs.error) {
                                deferred.reject(qs);
                            } else {
                                deferred.resolve(qs);
                            }

                            $interval.cancel(polling);

                            Popup.popupWindow.close();
                        }
                    } catch (error) {
                    // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
                    }

                    if (!Popup.popupWindow || Popup.popupWindow.closed || Popup.popupWindow.closed === undefined) {
                        $interval.cancel(polling);
                    }
                }, 50);

                return deferred.promise;
            };

            Popup.prepareOptions = function(options) {
                options = options || {};
                //var width = (utilsFactory.viewport.y - 600) || options.width || 500;
                //var height = (utilsFactory.viewport.x - 300) || options.height || 500;
                //width  = (width > 1000) ? 1000 : width;
                //height = (height < 500) ? 500 : height;

                var width =  options.width || 500;
                var height =  options.height || 500;


                return angular.extend({
                    width: width,
                    height: height,
                    left: $window.screenX + (($window.outerWidth - width) / 2),
                    top: $window.screenY + (($window.outerHeight - height) / 2.5)
                }, options);
            };

            Popup.stringifyOptions = function(options) {
                var parts = [];
                angular.forEach(options, function(value, key) {
                    parts.push(key + '=' + value);
                });
                return parts.join(',');
            };

            return Popup;

        }
})();
