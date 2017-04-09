///<reference path="../../Application.ts"/>
///<reference path="../../core/Api.ts"/>
///<reference path="../../core/services/BatchHttp.ts"/>
///<reference path="../../core/services/UserSettingsService.ts"/>

module Marktguru {
    export class OffersController {
		advertisers: Advertiser[];
		results: AdvertiserDto[];
		offersParams: {limit: number, advertiserId: string, zipcode: string, as: string}[];

		constructor(api: ApiFactory, private batchHttp: BatchHttp,
			private $timeout: ng.ITimeoutService, private userSettingsService: UserSettingsService,
			$scope: ng.IScope) {

			api.advertisers.query({ limit: 64, as: "mobile" }).then(res => {
				this.results = res.results;
				this.advertisers = res.results.map(_ => _.data);
				this.load();
			});
			$scope.$on(userSettingsService.changeEvent, () => this.load());
		}

		load() {
			this.batchHttp.init();
			this.offersParams = [];
			var location = this.userSettingsService.load().location;

			for(var i = 0; i < this.results.length; i++) {

				this.offersParams.push({
					limit: 5,
					advertiserId: this.results[i].id,
					zipcode: location != null ? location.zipCodes[0] : "",
					as: "mobile"
				});
			}
			this.$timeout(() =>  this.batchHttp.flush(), 1); // flush on next digest cycle
		}

    }

	app.controller("OffersController", OffersController);
}