///<reference path="../../Application.ts"/>
///<reference path="../../core/Api.ts"/>
///<reference path="../../core/services/UserSettingsService.ts"/>

module Marktguru {
    export class HomeController {
        header = "Marktguru web";
        message = "Test";

        sushiOffersParams: {};
        sushiTitle: string;
        teasersParams;
        topOffersParams;
        worldParams;
        nearbyStoresParams;

        constructor(private userSettingsService: UserSettingsService, $scope: ng.IScope) {
            this.init();
            $scope.$on(userSettingsService.changeEvent, () => this.init());
        }

        init() {
            var settings = this.userSettingsService.load(),
                location = settings.location != null ? {
                    zipcode: settings.location.zipCodes[0],
                   // latitude: settings.location.latitude,
                    //longitude: settings.location.longitude
                } : {};

            /**
             * Sushi Offers Params
             */
            this.sushiTitle = "ALLE PROSPEKTE";
            this.sushiOffersParams = location;

            /**
             * Get top offers
             */
            this.worldParams = angular.extend({
                limit: 2,
                type: "world",
                as: "mobile"
            }, location);

            this.teasersParams = angular.extend({
                limit: 2,
                type: "teaser",
                as: "mobile"
            }, location);

            /**
             * Get top offers
             */
            this.topOffersParams = angular.extend({
                limit: 6,
                as: "mobile"
            }, location);

            /**
             * Get stores that are nearby
             */
            this.nearbyStoresParams = angular.extend({ limit: 6 }, location);
        }
    }

    app.controller("HomeController", HomeController);
}