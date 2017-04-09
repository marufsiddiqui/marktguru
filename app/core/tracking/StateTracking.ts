///<reference path="../../Application.ts"/>
///<reference path="../services/UserSettingsService.ts"/>
///<reference path="GoogleAnalytics.ts"/>
///<reference path="TrackingSources.ts"/>

module Marktguru {

	class SegmentationInfo {
		value: number;
	}
	export class StateTracking {
		private segmentationKey = "mg:detailed-tracking";
		private detailed = false;
		private lastEvent = Date.now();

        constructor($rootScope: ng.IScope, private ga: GoogleAnalytics, config: Configuration,
			localStorage: LocalStoreService, $window: ng.IWindowService) {
			var segmentation = localStorage.get<SegmentationInfo>(this.segmentationKey);
			if (!segmentation) {
				segmentation = { value: Math.random() * 100 };
				localStorage.set(this.segmentationKey, segmentation);
			}
			if (segmentation.value < config.detailedUserTracking) this.detailed = true;

			this.detailed = true;

			ga.event("Visit");

			$window.addEventListener("unload", () => {
				ga.event("End of Visit");
			});

			$rootScope.$on("mg:events-screenChange", (_e, data) => {
				this.trackScreen(data);
			})
        }

		public trackScreen(name: string) {
			if (this.detailed && name) {
				this.ga.screenview(name);
			} else {
				var now = Date.now();
				if ((now - this.lastEvent) >= 15 * 60 * 1000) {
					this.ga.event("Keep alive");
					this.lastEvent = now;
				}
			}
		}
    }

    app.service("stateTracking", StateTracking);
    app.run((stateTracking: StateTracking) => { stateTracking;});

}