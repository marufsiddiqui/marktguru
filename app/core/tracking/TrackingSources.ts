module Marktguru {

	export class TrackingSources {
		/* Areas */
		public static homeOffers = "Home page top offers area";
		public static homeTeaser = "Home page teaser area";
		public static homeLeaflets = "Home page top leaflets area";
		public static homeFavorites = "Home page favorite leaflets area";
		/* Screens */
		public static offersByAdvertiser = "Offers by advertiser page";
		public static offersForAdvertiser = "All offers of advertiser page";
		public static shopingList = "Shopping list page";
		public static searchNoResult = "SERP 0 page";
		public static searchResult = "SERP1 page";
		public static searchWithStore = "SERP2 page";
		public static leafletsByIndustry = "All leaflets by industry page";
		public static pageflip = "Leaflet pageflip page";
		public static store = "Single store page";
		public static home = "Home page";
		public static pageflipOverview = "Leaflet thumbnails page";
		public static offerDetails = "Offer details page";
		public static storeList = "Store list page";
	}

	export class TrackingSourceService {
		private override = false;
		private source:string;
		 constructor($rootScope: ng.IScope){
            $rootScope.$on('$stateChangeSuccess', (_event, toState: ng.ui.IState, _toParams, fromState: ng.ui.IState, _fromParams) => {
				if(toState.name && fromState.name) {
					var toScreen = this.screens[toState.name];
					var fromScreen = this.screens[fromState.name];
					if(fromScreen && !this.override) this.source = fromScreen;
					if(toScreen) $rootScope.$broadcast("mg:events-screenChange", toScreen);
					this.override = false;
				}
            });
        }

		private screens: {[key: string]: string  } = {
			"root.home": TrackingSources.home,
			"root.offers": TrackingSources.offersByAdvertiser,
			"root.retailersOffers": TrackingSources.offersForAdvertiser,
			"root.stores": TrackingSources.storeList,
			"root.storeDetails": TrackingSources.store,
			"root.leaflets": TrackingSources.leafletsByIndustry,
			"leaflet.pageflipIndex": TrackingSources.pageflipOverview,
		};

		public setSource(source: string) { this.source = source; this.override = true; }
		public current = () => this.source;
	}
	app.service("trackingSourceService", TrackingSourceService);
}