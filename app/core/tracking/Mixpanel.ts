///<reference path="../../Application.ts"/>

module Marktguru {

	declare var mixpanel: IMixpanel;

	interface IMixpanel {
        track(name: string, event: {}, callback?: () => void): void;
		register(superProperties: {}): void;
		init(key: string);
	}

	export class Mixpanel {
		constructor(private $q: ng.IQService, private apiConfig: ApiConfiguration) {
			if(!apiConfig.mixpanelTrackingKey) {
				return;
			}
			mixpanel.init(apiConfig.mixpanelTrackingKey);
		}
		track(name: string, event: {}) {
			var deferd = this.$q.defer();
			if(this.apiConfig.mixpanelTrackingKey)
				mixpanel.track(name, event, () => { deferd.resolve(); });
			else
				deferd.resolve();
			return deferd.promise;
		}
		register(superProperties: {}) {
			if(this.apiConfig.mixpanelTrackingKey)
				mixpanel.register(superProperties);
		}
	}

	app.service("mixpanel", Mixpanel);
}