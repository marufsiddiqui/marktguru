///<reference path="UserSettingsService.ts"/>

module Marktguru {
    // if (!window["jasmine"]) { // do not run boot task for unit tests
    //     app.run(($http:ng.IHttpService, apiConfig: ApiConfiguration, config: Configuration) => {
    //         $http.get<Configuration>(`${apiConfig.protocol}://${apiConfig.apiHostAddress}/api/v1/configurations/web`).then(remote => {
    //             config.mediaHostAddress = remote.data.mediaHostAddress;                
    //             var header = remote.headers ? remote.headers("x-clientkey") : null;
    //             if (header) {
    //                 localStorage.setItem("mg:client-key", header);
    //         }});
    //     })
    // }

    app.factory("clientKeyInterceptor", ($q: ng.IQService) => {
        var storeKey = "mg:client-key";
        var timestampMarker = {
            request: function(config) {
                var key = localStorage.getItem(storeKey);
                if (key)
                    config.headers["X-ClientKey"] = key;
                return config;
            },
            response: function(response) {
                var header = response.headers()["x-clientkey"];
                if (header) {
                    localStorage.setItem(storeKey, header);
                }
                return response;
            },
            responseError: function(response) {
                if (response.status == 401) {
                    localStorage.setItem(storeKey, "");
                }
                return $q.reject(response);
            }
        };
        return timestampMarker;
    });
}