///<reference path="../../Application.ts"/>
///<reference path="../Api.ts"/>

module Marktguru {
	export class ExternalTracker {
		constructor(private $http: ng.IHttpService) {

		}

		track(url: string) {
			if (url)
				this.$http.get(url, { cache: false });
		}
	}

	app.service("externalTracker", ExternalTracker);
}