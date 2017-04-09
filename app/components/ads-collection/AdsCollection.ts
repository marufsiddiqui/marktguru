///<reference path="../../core/tracking/TrackingService.ts"/>

module Marktguru {
	class AdsCollectionController {
		adCollections: PagedList<AdCollectionDetailed>;
		params: { type: string};
		location: Location;

		/*@ngInject*/
		constructor(private api: ApiFactory, private $state: ng.ui.IStateService, private trackingSourceService: TrackingSourceService, private $window: ng.IWindowService,
			private $scope: ng.IScope, userSettingsService: UserSettingsService, apiConfig: ApiConfiguration) {
			$scope.$watch(<any>angular.bind(this, () => this.params), val => {
				if (!val) return;
				api.advertisementcollections.query(val).then(res => {
					this.adCollections = res;
					for (var ad of this.adCollections.results) {
						ad.imageUrl = api.advertisementcollections.images(ad.id, "default").xlarge(0);
					}
				});
			});
			var settings = userSettingsService.load();
			this.location = settings.location || apiConfig.defaultLocation;
		}
		commands = {
			"leafletFlight": (ad: AdCollectionDetailed) => {
				this.api.leafletFlights.bestleaflet(ad.command.leafletFlightId, { 
					latitude: this.location.latitude, 
					longitude: this.location.longitude, 
					zipcode: this.location.zipCodes[0]}).then(leaflet => {
						var id = leaflet ? leaflet.id : ad.references[0].leafletId;
						var pageIndex = 0;
						if(ad.references){
							for(var ref of ad.references){
								if(ref.leafletId == id) pageIndex = ref.pageIndex;
							}
						}
						this.$state.go("leaflet.pageflip", { id: id, page: pageIndex });
				});
			},
			"leaflet": ad => this.$state.go("leaflet.pageflip", { id: ad.command.leafletId, page: ad.command.pageIndex || 0 }),
			"offer": ad => this.$state.go("root.offerDetails", { id: ad.command.offerId }),
			"search": ad => this.$state.go("root.search.results", { query: ad.command.terms }),
			"link": ad => {
				this.$scope.$emit("mg:events:clickout", { advertisment: ad, name: ad.name, type: "adcollection", url: ad.command.url});
				this.$window.open(ad.command.url, "_blank");
			}			
		};

		triggerCommand(ad: AdCollectionDetailed) {
			this.trackingSourceService.setSource(TrackingSources.homeTeaser);
			var action = this.commands[ad.command.type];
			if(action) action(ad);
			else console.error("not supported command ", ad.command.type);
		}
	}

	var directiveName = "mgAdsCollection";
	app.directive(directiveName, () => {
		return {
			scope:{},
			templateUrl: "ads-collection/AdsCollection.html",
			controller: AdsCollectionController,
			controllerAs: "vm",
			bindToController: { params: `=${directiveName}`}
		};
	});
}