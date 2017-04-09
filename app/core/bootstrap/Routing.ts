/// <reference path="../../Application.ts"/>
/// <reference path="../Api.ts"/>

module Marktguru {
    export class RouteConfiguration {
        /*@ngInject*/
        constructor(private $stateProvider: ng.ui.IStateProvider) {
            $stateProvider.state("root", {
                templateUrl: "views/layout.html",
                abstract: true
            });

            this.addRoute("/", "home")
                .addRoute("/offers", "offers")
                .addRoute("/offers/:id", "offerDetails", Resolve.emptySearch)
                .addRoute("/retailer/:id/offers", "retailersOffers")
                .addRoute("/stores/chain/:id", "stores")
                .addRoute("/stores/:id", "storeDetails")
                .addRoute("/leaflets", "leaflets")
                
            $stateProvider.state("leaflet", {
                url: "/leaflets/:id",
                abstract: true,
                templateUrl: "views/PageflipLayout.html",
                resolve: Resolve.leaflet
            })
            .state("leaflet.pageflipIndex", this.state("/index", "pageflipIndex"))
            .state("leaflet.pageflip", this.state("/page/:page", "pageflip"));

            $stateProvider.state("root.search", {
                url: "/search/:query",
                abstract: true,
                template: "<ui-view/>",
                resolve: Resolve.search
            })
            .state("root.search.results", this.state("/results", "search"))
            .state("root.search.offerDetails", this.state("/:id", "offerDetails"));
        }

        state(url: string, component: string, resolve?: {}): ng.ui.IState {
            return {
                url: url,
                templateUrl: `views/${component}.html`,
                controller: `${component.charAt(0).toUpperCase() }${component.slice(1) }Controller`,
                controllerAs: component,
                resolve: resolve
            }
        }

        addRoute(url: string, component: string, resolve?: {}) {
            this.$stateProvider.state(`root.${component}`, this.state(url, component, resolve));
            return this;
        }
    }

    export class Resolve {
        static leaflet: any = {
            /*@ngInject*/
            leaflet: (api: ApiFactory, $stateParams, $state: ng.ui.IStateService) => {
                return api.leaflets.get($stateParams.id, true).catch(() => $state.go("root.home"));
            },
            /*@ngInject*/
            store: (api: ApiFactory, userSettingsService: UserSettingsService, leaflet: LeafletDetailed) => api.leaflets.stores(leaflet.id, userSettingsService.load().location, 1).then(store => store ? store.results[0] : undefined)
        };
        static search: any = {
            /*@ngInject*/
            search: (api: ApiFactory, $stateParams, userSettingsService: UserSettingsService) => {
                var settings = userSettingsService.load(),
				zip = settings.location != null ? settings.location.zipCodes[0] : "";
                return api.advertisments.query({ q: $stateParams.query, zipcode: zip, as: "mobile", limit: 64});
            }
        };
        static emptySearch: any = {
            /*@ngInject*/
            search: () => null
        };
    }


    // app.config(($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) => {
    //     $urlRouterProvider.otherwise("/");
    //     new RouteConfiguration($stateProvider);
    // });

    // angular.module('mg').constant('apiConfig',
    // {
    //     "mode": "dev",
    //     "protocol": "https",
    //     "apiKey": "8Kk+pmbf7TgJ9nVj2cXeA7P5zBGv8iuutVVMRfOfvNE=",
    //     "clientKey": "92kBL9iP1NzMEhkhJpY6ipLTFcR9Q+voD6W6ICRaNyc=",
    //     "apiHostAddress": "api.marktguru.de",
    //     "googleTrackingKey": "UA-67044615-2",
    //     "mixpanelTrackingKey": "69ea486af0f558054977f6e7a4a8e6e8",
    //     "defaultLocation": {
    //         "zipCodes": [1010],
    //         "name": "Wien Innere Stadt",
    //         "latitude": 48.208173,
    //         "longitude": 16.373807
    //     }
    // });
    // angular.module('mg').constant('config',
    // {
    //     "mediaHostAddress": "api.marktguru.de",
    //     "apiVersion": 1,
    //     "currency": "EUR",
    //     "defaultLanguage": "de",
    //     "supportedLanguages": [
    //         "de",
    //         "en",
    //         "ru"
    //     ],
    //     "defaultTimeZone": "Central European Standard Time",
    //     "defaultPagingLimit": 32,
    //     "maximumPagingLimit": 64,
    //     "maximumFavouriteItems": 50,
    //     "maximumShoppingListItems": 50,
    //     "detailedUserTracking": 70,
    //     "noBrandName": "thisisnobrand123"
    // });
}
