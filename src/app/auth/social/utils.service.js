/*
 * © Ipvision
 */


angular
    .module('ringid.social')
    .service('socialUtils', function() {
        var _self = this;

        _self.camelCase = function(name) {
        return name.replace(/([\:\-\_]+(.))/g, function(_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
            });
        };

        _self.parseQueryString = function(keyValue) {
            var obj = {}, key, value;
            angular.forEach((keyValue || '').split('&'), function(keyValue) {
                if (keyValue) {
                    value = keyValue.split('=');
                    key = decodeURIComponent(value[0]);
                    obj[key] = angular.isDefined(value[1]) ? decodeURIComponent(value[1]) : true;
                }
            });
            return obj;
        };

        _self.joinUrl = function(baseUrl, url) {
            if (/^(?:[a-z]+:)?\/\//i.test(url)) {
                return url;
            }

            var joined = [baseUrl, url].join('/');

            var normalize = function(str) {
                return str
                    .replace(/[\/]+/g, '/')
                    .replace(/\/\?/g, '?')
                    .replace(/\/\#/g, '#')
                    .replace(/\:\//g, '://');
            };

            return normalize(joined);
        };

        _self.merge = function(obj1, obj2) {
            var result = {};
            for (var i in obj1) {
                if (obj1.hasOwnProperty(i)) {
                    if ((i in obj2) && (typeof obj1[i] === 'object') && (i !== null)) {
                        result[i] = _self.merge(obj1[i], obj2[i]);
                    } else {
                        result[i] = obj1[i];
                    }
                }
            }
            for (i in obj2) {
                if (obj2.hasOwnProperty(i)) {
                    if (i in result) {
                        continue;
                    }
                    result[i] = obj2[i];
                }
            }
        return result;
    };
});


