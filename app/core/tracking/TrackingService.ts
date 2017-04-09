///<reference path="../../Application.ts"/>
///<reference path="../services/UserSettingsService.ts"/>
///<reference path="Mixpanel.ts"/>
///<reference path="Agof.ts"/>
///<reference path="AgofCodes.ts"/>
///<reference path="TrackingSources.ts"/>
///<reference path="InternalTracker.ts"/>
///<reference path="ExternalTracker.ts"/>
///<reference path="StateTracking.ts"/>

module Marktguru {

	class VisitInfo {
		lastSeen: Date;
		totalVisits: number;
		firstVisit: Date;
	}
	class LeafletViewInfo {
		start: number;
		pageEntered: number;
		pagesShown: number;
		pageCount: number;
		openEvent: {};
	}
	class OfferViewInfo {
		start: number;
		openEvent: {};
	}

    export class TrackingService {
		private visitInfoKey = "mg:visit-info";
		private leafletView: LeafletViewInfo;
		private offerView: OfferViewInfo;
		private zip: string;

		constructor(private localStorage: LocalStoreService, private userSettingsService: UserSettingsService,
			private mixpanel: Mixpanel, private internalTracker: InternalTracker, private externalTracker: ExternalTracker, 
            private stateTracking: StateTracking, private agof: Agof, $rootScope: ng.IScope,
			private trackingSourceService: TrackingSourceService, private config: Configuration) {
				
			var now = new Date();
			var visitInfo = this.localStorage.get<VisitInfo>(this.visitInfoKey) || { firstVisit: now, lastSeen: now, totalVisits: 0 };
			visitInfo.totalVisits = visitInfo.totalVisits + 1;
			this.localStorage.set(this.visitInfoKey, visitInfo);
			visitInfo = this.localStorage.get<VisitInfo>(this.visitInfoKey) || { firstVisit: now, lastSeen: now, totalVisits: 0 };

			var settings = this.userSettingsService.load();
			this.zip = settings.location != null ? settings.location.zipCodes[0] : "";
			this.mixpanel.register({
				"MG ZIP": this.zip,
				"ZIP setting": "manual",
				"Last seen": visitInfo.lastSeen,
				"Total visits": visitInfo.totalVisits,
				"First visit": visitInfo.firstVisit
			});

			$rootScope.$on("mg:events:clickout", (_e, data) => {
				this.clickOut(data.advertisment, data.name, data.type, data.url).then(data.done);
			});
		}

		leafletOpened(leaflet: LeafletDetailed, pageIndex: number) {
			this.stateTracking.trackScreen(`Page flip: Adv: ${leaflet.advertiser.name}, LID: ${leaflet.id}, PI: ${pageIndex+1};`);
			if (this.leafletView) return;

			var event = {
				"Advertiser name": leaflet.advertiser ? leaflet.advertiser.name : "",
				"Leaflet ID": leaflet.id,
				"Leaflet Flight ID": leaflet.leafletFlightId,
				"Industry name": leaflet.industry ? leaflet.industry.name : "",
				"Source": this.trackingSourceService.current(),
			};

			this.leafletView = {
				start: new Date().getTime(),
				pageEntered: pageIndex + 1,
				pagesShown: 1,
				pageCount: leaflet.pageImages.count,
				openEvent: event
			};

            this.mixpanel.track("Leaflet opened", event);
			this.internalTracker.leafletOpened(leaflet, this.trackingSourceService.current(), this.zip);
			this.externalTracker.track(leaflet.externalTrackingUrls[0]);
            
			if(this.agof != null) {
            	this.agof.track("Leaflet opened", AgofCodes.pageflip);
			}
		}

		// todo: add per page time counting
		pageShow(count: number) {
			if (!this.leafletView) return;

			this.leafletView.pagesShown = this.leafletView.pagesShown + count;
		}

		leafletClosed(pageIndex: number) {
			if (this.leafletView) { //check first if there was a leaflet open event
				var event = {
					"Duration": Math.ceil((Date.now() - this.leafletView.start) / 1000),
					"Total pages": this.leafletView.pageCount,
					"Total displayed pages": this.leafletView.pagesShown,
					"Pageflip entered at page": this.leafletView.pageEntered,
					"Pageflip exited at page": pageIndex + 1,
					"Source": this.trackingSourceService.current(),
				};

				this.mixpanel.track("Leaflet closed", angular.extend(this.leafletView.openEvent, event));
				this.internalTracker.leafletClosed();
				delete this.leafletView;
			}
		}

		offerOpened(offer: OfferDetailed) {
			this.stateTracking.trackScreen(`Offer: Adv: ${offer.advertisers[0].name}, OID: ${offer.id};`);

			if (this.offerView) return;

			var event = {
				"Advertiser name": offer.advertisers[0].name,
				"Brand name": offer.brand.name,
				"Product name": offer.product.name,
				"Advertorial name": this.config.noBrandName == offer.brand.name ? offer.product.name : `${offer.brand.name} - ${offer.product.name}`,
				"Offer ID": offer.id,
				"Source": this.trackingSourceService.current(),
				"Categories": offer.categories.map(_ => _.name),
				"Leaflet Flight ID": offer.leafletFlightId,
				"Offerprice": offer.price,
				"Recommended retail price": offer.oldPrice,
				"Discount":  100 - Math.floor(offer.price*10000/offer.oldPrice)/100,
				"Type": offer.type,
				"Loyalty membership required": offer.requiresLoyalityMembership,
			}
			this.offerView = {
				start: Date.now(),
				openEvent: event
			};
			
            this.mixpanel.track("Offer opened", event);
            this.internalTracker.offerOpened(offer, this.trackingSourceService.current(), this.zip);
			this.externalTracker.track(offer.externalTrackingUrls[0]);
            
			if(this.agof != null) {
            	this.agof.track("Offer opened", AgofCodes.offerDetails);
			}
		}

		offerClosed() {
			if (this.offerView) {
				this.internalTracker.offerClosed();
				delete this.offerView;
			}
		}

		private clickOut(advertisement: Advertisement, name: string, type: string, url: string) {
			return this.mixpanel.track("Clickout", {
				"Advertiser name": (advertisement.advertisers && advertisement.advertisers.length > 0) ? advertisement.advertisers[0].name : "",
				"Advertorial type": type,
				"Advertorial name": name,
				"Advertorial ID": advertisement.id,
				"Target": url,
				"Source": this.trackingSourceService.current(),
			});
		}

		search(query: string, type: string, count: number) {
			this.stateTracking.trackScreen(type == "advertisements" ? TrackingSources.searchResult : TrackingSources.searchNoResult);

			if(this.agof != null) {	
				switch(type) {
					case "noResults": // SERP0
						this.agof.track("No search results", AgofCodes.searchNoResults);
					break;
					case "advertisements": // SERP 1/2
						this.agof.track("Search results", AgofCodes.searchResults);
					break;
				}
			}

            return this.mixpanel.track("Search", {
				"Keyword": query,
				"SERP type": type,
				"Offer count": count,
				"Source": this.trackingSourceService.current()
			});
		}
	}

	app.service("tracking", TrackingService);
}