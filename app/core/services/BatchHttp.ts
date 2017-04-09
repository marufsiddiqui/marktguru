///<reference path="../../Application.ts"/>
///<reference path="MemoryCache.ts"/>
///<reference path="HttpUtils.ts"/>

module Marktguru {
    class Request<T>{
        url: string;
        defer: ng.IDeferred<T>;
    }

    export class BatchHttp {
        private requestQueue: { [key: string]: Request<any> } = {};
        private bootRequest: ng.IPromise<void>;
        /*@ngInject*/
        constructor(private $http: ng.IHttpService, private $q: ng.IQService,
            private apiConfig: ApiConfiguration, private httpUtils: HttpUtils,
            private $state: ng.ui.IStateService, config: Configuration) { 
                this.bootRequest = $http.get<Configuration>(`${apiConfig.protocol}://${apiConfig.apiHostAddress}/api/v1/configurations/web`).then(remote => {
                    if(remote.data && !config.mediaHostAddress) {
                        for(var prop in remote.data) { config[prop] = remote.data[prop]}
                    }                    
                    var header = remote.headers ? remote.headers("x-clientkey") : null;
                    if (header) {
                        localStorage.setItem("mg:client-key", header);
                }});
            }

        private active = false;
        init() { this.active = true; }

        get<T>(url: string, config: ng.IRequestShortcutConfig = { params: null }): ng.IPromise<ng.IHttpPromiseCallbackArg<T>> {            
            var defer = this.$q.defer();
            var fullUrl = this.httpUtils.buildUrl(url.replace(/^.*\/\/[^\/]+/, ''), config.params);
            var cached = this.$state.current.data ? this.$state.current.data[fullUrl] : null;
            if (cached) {
                this.handeResponse(defer, { status: 200, data: cached });
                return defer.promise;
            }
            // var cached = this.cache.get("batch-request:" + fullUrl);
            // if (cached) {
            //     this.handeResponse(defer, cached);
            // } else {

            if (!this.active) return this.bootRequest.then(() => { return this.$http.get(url, config); });
            this.requestQueue[fullUrl] = { url: fullUrl, defer: defer };

            return defer.promise;        
        }

        flush() {
            var urls = Object.keys(this.requestQueue);
            if (urls.length > 0) {
                this.$http.get(`${this.apiConfig.protocol}://${this.apiConfig.apiHostAddress}/api/v1/batch`, {
                    params: { compressedBatchUrls: this.compressUrls(urls) }
                }).then(res => {
                    if(!res.data) throw new Error("Response body missing for batch.");
                    for (var url of urls) {
                        var response = res.data[url];
                        //this.cacheResponse(url, response);
                        this.handeResponse(this.requestQueue[url].defer, response);
                        delete this.requestQueue[url];
                    }
                }, err => {
                    for (var url of urls) {
                        this.handeResponse(this.requestQueue[url].defer, err);
                        delete this.requestQueue[url];
                    }
                });
            }
            this.active = false;
        }

        post<T>(url: string, data: {}) {
            return this.$http.post<T>(url, data);
        }

        private compressUrls(urls: string[]) {
            var json: string = JSON.stringify(urls);
            var ziped: string = pako.deflate(json, { to: 'string' });
            return btoa(ziped);
        }

        private handeResponse(defer, response) {
            if (this.isSuccess(response.status)) defer.resolve(response);
            else defer.reject(response);
        }

        // private cacheResponse(url, response) {
        //     if (this.isSuccess(response.status)) {
        //         var cacheControl = this.httpUtils.parseCacheControl(response.headers["Cache-control"]);
        //         if (cacheControl && !cacheControl["no-cache"] && cacheControl["max-age"]) {
        //             this.cache.put("batch-request:" + url, response, cacheControl["max-age"] * 1000);
        //         }
        //     }
        // }

        private isSuccess = status => status <= 200 && status < 300;
    }

    app.service("batchHttp", BatchHttp);

    declare var pako: any;
}