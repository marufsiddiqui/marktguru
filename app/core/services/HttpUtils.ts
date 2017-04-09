///<reference path="../../Application.ts"/>

module Marktguru {

    export class HttpUtils {
       public buildUrl(url, params) {
            if (!params) return url;
            var parts: string[] = [];
            var keys = Object.keys(params).sort();
            for(var key of keys){
                var value = params[key];
                if (value === null || angular.isUndefined(value)) return;
                if (!angular.isArray(value)) value = [value];

                angular.forEach(value, function(v) {
                    if (angular.isObject(v)) {
                        v = angular.toJson(v);
                    }
                    parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(v));
                });
            }
            return url + ((url.indexOf('?') == -1) ? '?' : '&') + parts.join('&');
        }

        private cacheControlRegex = /(?:^|(?:\s*\,\s*))([^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)(?:\=(?:([^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)|(?:\"((?:[^"\\]|\\.)*)\")))?/g;
        public parseCacheControl(field) {
            var header = {};
            var error = field.replace(this.cacheControlRegex, (_$0, $1, $2, $3) => {
                var value = $2 || $3;
                header[$1] = value ? value.toLowerCase() : true;
                return '';
            });

            if (header['max-age']) {
                header['max-age'] = parseInt(header['max-age'], 10);
                if (isNaN(header['max-age'])) {
                    return null;
                }
            }

            return (error ? null : header);
        };
    }
    app.service("httpUtils", HttpUtils);
}