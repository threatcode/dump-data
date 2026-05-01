/*
 * copyright Ipvision
 */



    var RingHttp = function (settings) { //jshint ignore:line
        var timeStamp = new Date().getTime();
        var requestQueue = {},
            config = {
                //contentType: 'application/x-www-form-urlencoded'
                'contentType': 'multipart/formdata'
            };
        var parse = function (req) {
            var result;
            try {
                result = JSON.parse(req.responseText);
            } catch (e) {
                result = req.response;
            }
            return [result, req];
        };

        function XHR(type, url, data, responseType) {
            var templateRequest = false,
                methods = {
                    success: function () {
                    },
                    error: function () {
                    },
                    abort: function () {
                    },
                    progress: function () {
                    }
                };


            var templateIndex = url;
            url = /^(http|https):\/\//.test(url) ? url : settings.baseUrl + (url.indexOf('/') === 0 ? url : '/' + url);

            var ajaxRequest = {
                success: function (callback) {
                    methods.success = callback;
                    return ajaxRequest;
                },
                error: function (callback) {
                    methods.error = callback;
                    return ajaxRequest;
                },
                abort: function (callback) {
                    methods.abort = callback;
                    return ajaxRequest;
                },
                progress: function (callback) {
                    methods.progress = callback;
                    return ajaxRequest;
                },
                abortRequest: function () {
                    xhr.abort();
                }
            };

            try {
                var xhr = new XMLHttpRequest();

                xhr.open(type, url, true);
                //xhr.setRequestHeader('x-app-version', settings.apiVersion )
                xhr.responseType = responseType || 'text';

                xhr.onreadystatechange = function () {
                    var response;
                    if (xhr.readyState === 4) {
                        response = parse(xhr);
                        if (xhr.status === 200) {
                            methods.progress.apply(methods, [100]);
                            methods.success.apply(methods, response);
                        } else {
                            methods.error.apply(methods, response);
                        }
                    }

                };

                xhr.upload.onabort = function () {
                    methods.abort.apply(methods);
                };

                xhr.upload.onprogress = function (e) {
                    methods.progress.apply(methods, [Math.round(e.loaded / e.total * 100) - 1]);
                };

                xhr.send(data);


            } catch (e) {
                RingLogger.alert('xmlhttprequest not available');
            }


            return ajaxRequest;
        }


        return {
            //create: XHRWorking,
            get: function (url, headers, responseType) {
                return XHR('GET', url, headers, responseType);
            },
            post: function (url, data, responseType) {
                return XHR('POST', url, data, responseType);
            }

        };

    }(settings);
