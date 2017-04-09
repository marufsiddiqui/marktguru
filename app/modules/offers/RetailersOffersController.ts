///<reference path="../../Application.ts"/>
///<reference path="../../core/Api.ts"/>

module Marktguru {
    export class RetailersOffersController {
		offersParams: {};

		constructor($stateParams, userSettingsService: UserSettingsService) {
			var location = userSettingsService.load().location;
			this.offersParams = {
				limit: 10,
				aid: $stateParams.id.replace("-","/"),
				zipcode: location != null ? location.zipCodes[0] : "",
				as: "mobiledetailed"
			};
		}

    }

	app.controller("RetailersOffersController", RetailersOffersController);
}