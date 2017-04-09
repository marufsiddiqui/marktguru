///<reference path="../../Application.ts"/>

module Marktguru {
    /*
      Boot script
    */
    if (!window["jasmine"]) { // do not run boot task for unit tests

        if ('serviceWorker' in navigator) {            
            navigator.serviceWorker.register('service-worker.d41d8cd9.js');                
        }

        // agof tracking script
        setTimeout(() => {
            var e:any = document.createElement("script")
            var body = document.getElementsByTagName("script")[0]; 
            e.async = 1; e.src = "https://script.ioam.de/iam.js"; 
            body.parentNode && body.parentNode.insertBefore(e, body)
        }, 5000);

        // register sparose boot info
        window["sparose"] && window["sparose"]();

        // application bootstrap
        angular.element(document).ready(() => {
            angular.bootstrap(document, ["mg"]);
        });
    }
}