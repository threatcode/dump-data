/*
 * copyright Ipvision
 */




    angular
        .module('ringid.global_services')
        .factory('$ringhttp', ringhttp);


    ringhttp.$inject = ['settings', '$templateCache'];
    function ringhttp(settings, $templateCache) { //jshint ignore:line
        var timeStamp =  new Date().getTime();
        var requestQueue = {},
            config = {
            contentType: 'application/x-www-form-urlencoded'
            //'contentType': 'multipart/formdata'
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

        function XHR(type, url, data, responseType, headers) {
            var templateRequest = false,
                progressVal = 0,
                methods = {
                success: function() {},
                error: function() {},
                abort: function() {},
                progress: function() {}
            };


            var templateIndex = url;
            url = /^(http|https):\/\//.test(url) ? url : settings.baseUrl + (url.indexOf('/') === 0 ? url : '/' + url);

            var ajaxRequest = {
                success: function(callback) {
                    methods.success = callback;
                    return ajaxRequest;
                },
                error: function(callback) {
                    methods.error = callback;
                    return ajaxRequest;
                },
                abort: function(callback) {
                    methods.abort = callback;
                    return ajaxRequest;
                },
                progress: function(callback) {
                    methods.progress = callback;
                    return ajaxRequest;
                },
                abortRequest: function() {
                    xhr.abort();
                }
            };

            try {
                var xhr = new XMLHttpRequest();
                templateRequest =  (type === 'GET' && /\.html$/.test(url));
                if (templateRequest && requestQueue.hasOwnProperty(templateIndex)) {
                        requestQueue[templateIndex].push(methods);
                } else if (templateRequest && $templateCache.get(templateIndex)) {
                    setTimeout(function() {
                        //if (requestQueue[url]) {
                            //requestQueue[url].forEach(function(methods) {
                                //methods.success.apply(methods, [$templateCache.get(templateIndex), xhr]);
                            //});
                            //delete requestQueue[url];
                        //} else {
                            methods.success.apply(methods, [$templateCache.get(templateIndex), xhr]);
                        //}
                    });
                } else {
                    if (templateRequest) {
                        url = url + '?time=' + timeStamp; // new Date().getTime();
                        requestQueue[templateIndex] = [];
                        requestQueue[templateIndex].push(methods);
                    }
                    xhr.open(type, url, true);
                    xhr.responseType = responseType || 'text';

                    xhr.onreadystatechange = function() {
                        var response ;
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                response = parse(xhr);
                                // if template put it inside templatecache
                                if (templateRequest) {
                                    $templateCache.put(templateIndex, response[0]);
                                    requestQueue[templateIndex].forEach(function(methods) {
                                        methods.success.apply(methods, [$templateCache.get(templateIndex), xhr]);
                                    });
                                    delete requestQueue[templateIndex];
                                } else {
                                    methods.progress.apply(methods, [100]);
                                    methods.success.apply(methods, response);
                                }
                            } else {
                                methods.error.apply(methods, response);
                            }

                        }
                    };

                    xhr.upload.onabort = function() {
                        methods.abort.apply(methods);
                    };

                    xhr.upload.onprogress= function(e) {
                        progressVal = Math.round(e.loaded / e.total * 100);
                        progressVal = progressVal > 0 ? progressVal-1 : progressVal;
                        //fileObj.progressVal = Math.round(e.loaded / e.total * 100);
                        methods.progress.apply(methods, [progressVal]);
                    };


                    xhr.send(data);
                }

            } catch (e) {
            }


            return ajaxRequest;
        }



        return {
            //create: XHRWorking,
            get: function(url, headers, responseType) {
                return XHR('GET', url, headers, responseType);
            },
            post: function(url, data, responseType) {
                return XHR('POST', url, data, responseType);
            }
        };

    }

