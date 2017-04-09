///<reference path="../../Application.ts"/>
///<reference path="../Api.ts"/>

module Marktguru {
	//todo: figure aout when to set firstHitInSession
	export class InternalTracker {
		private api: EventsApi;
		private leafletView: {};
		private offerView: {};
		constructor(api: ApiFactory) {
			this.api = api.events;
		}

		leafletOpened(leaflet: LeafletDetailed, source: string, zip: string) {
			this.leafletView = {
				source: source,
				leafletId: leaflet.id,
				zipCode: zip

			}
			this.api.track("leafletopened", angular.extend(this.leafletView, {
				firstHitInSession: true
			}));
		}

		leafletClosed() {
			this.api.track("leafletclosed", this.leafletView);
		}

		offerOpened(offer: OfferDetailed, source: string, zip: string) {
			this.offerView = {
				source: source,
				offerId: offer.id,
				zipCode: zip

			}
			this.api.track("offeropened", angular.extend(this.offerView, {
				firstHitInSession: true
			}));
		}

		offerClosed() {
			this.api.track("offerclosed", this.offerView);
		}
	}

	app.service("internalTracker", InternalTracker);
}