///<reference path="../../Application.ts"/>
///<reference path="../../core/Api.ts"/>
///<reference path="../../core/services/BatchHttp.ts"/>
///<reference path="../../core/services/UserSettingsService.ts"/>

module Marktguru {
    export class LeafletsController {
		industries: PagedList<IndustryDetailed>
		leafletsParams: {}[];

		constructor(api: ApiFactory, private batchHttp: BatchHttp,
			private $timeout: ng.ITimeoutService, private userSettingsService: UserSettingsService,
			$scope: ng.IScope) {
			var params = {
				"limit": "64",
				"as": "mobiledetailed"
			}

			api.industries.query(params).then(industrySuccess => {
				this.industries = industrySuccess;
				this.load();
			});
			$scope.$on(userSettingsService.changeEvent, () => this.load());
		}

		private load() {
			this.batchHttp.init();
			this.leafletsParams = new Array();
			var location = this.userSettingsService.load().location;
			for(var i = 0; i < this.industries.results.length; i++) {
				var industry = this.industries.results[i];

				var param = {
					industryid: industry.id,
					zipcode: location != null ? location.zipCodes[0] : ""
				};

				this.leafletsParams.push(param);
			}

			this.$timeout(() =>  this.batchHttp.flush(), 1); // flush on next digest cycle
		}
	}

	app.controller("LeafletsController", LeafletsController);
}