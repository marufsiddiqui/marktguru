/// <reference path="../typings/index.d.ts" />

declare var google: any;
declare var iom: any;

module Marktguru {

    export class ApiConfiguration {
        protocol: string;
        apiKey: string;
        apiHostAddress: string;
        applicationInsightsKey: string
        defaultLocation: Location;
        googleTrackingKey: string;
        mixpanelTrackingKey: string;
    }
    export class Configuration {
        defaultLanguage: string;
        detailedUserTracking: number;
        mediaHostAddress: string;
        noBrandName: string;
    }

    export var app = angular.module("mg", ["ui.router", "templates", "matchmedia-ng", "ngAnimate",
        "hmTouchEvents", "angular-inview", "ui.bootstrap", "angular-loading-bar", "ApplicationInsightsModule" ])
        .config(($httpProvider: ng.IHttpProvider, $locationProvider: ng.ILocationProvider, apiConfig: ApiConfiguration,
            cfpLoadingBarProvider, applicationInsightsServiceProvider) => {
            $locationProvider.html5Mode(true);
            if($httpProvider.defaults.headers)
                $httpProvider.defaults.headers.common["X-ApiKey"] = apiConfig.apiKey;
            $httpProvider.interceptors.push("clientKeyInterceptor");
            cfpLoadingBarProvider.includeBar = true;
            cfpLoadingBarProvider.latencyThreshold = 150;
            cfpLoadingBarProvider.includeSpinner  = false;

            if(apiConfig.applicationInsightsKey){ 
            applicationInsightsServiceProvider.configure(apiConfig.applicationInsightsKey, { 
                // applicationName: used as a 'friendly name' prefix to url paths 
                // ex: myAmazingapp/mainView 
                applicationName:'mg-web', 
                // autoPageViewTracking: enables the sending a event to Application Insights when  
                // ever the $locationChangeSuccess event is fired on the rootScope 
                autoPageViewTracking: true, 
                // autoLogTracking: enables the interception of calls to the $log service and have the trace  
                // data sent to Application Insights. 
                autoLogTracking: true, 
                // autoExceptionTracking: enables calls to the $exceptionHandler service, usually unhandled exceptions, to have the error and stack data sent to Application Insights. 
                autoExceptionTracking: true, 
                // sessionInactivityTimeout: The time (in milliseconds) that a user session can be inactive, before a new session will be created (on the next api call). Default is 30mins. 
                //sessionInactivityTimeout: 1800000 
                developerMode: false
            }); 
        } else { 
            applicationInsightsServiceProvider.configure("",{ autoPageViewTracking: false, autoLogTracking: false, autoExceptionTracking: false}); 
        } 
        });

    // Global keyup events
	app.run(($document: ng.IDocumentService, $rootScope: ng.IScope) => {
		$document.bind("keyup", event => {
			$rootScope.$broadcast("mg:keyup", event);
		})
	});        
}