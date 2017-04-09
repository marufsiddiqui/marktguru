///<reference path="../../Application.ts"/>

module Marktguru {

	declare var ga: (...args: any[]) => void;

	export class GoogleAnalytics {
		constructor(apiConfig: ApiConfiguration) {
			if(!apiConfig.googleTrackingKey) {
				return;
			}
			ga('create', apiConfig.googleTrackingKey, 'auto');
			ga('send', 'pageview');
		}

		screenview(name: string) {
			setTimeout(() => {
				ga('set', 'page', location.pathname);
				ga('send', 'pageview', {
					title: name,
					page: location.pathname
				});
			}, 100);		
		}

		event(name: string) {
			ga('send', 'event', 'web', name);
		}
	}

	app.service("ga", GoogleAnalytics);
}