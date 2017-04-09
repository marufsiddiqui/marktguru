///<reference path="../../Application.ts"/>
///<reference path="../../core/Api.ts"/>
///<reference path="../../core/tracking/TrackingService.ts"/>

module Marktguru {
	class LeafletFlightViewModel extends LeafletFlight {
		imageUrl: string
	}

	class LeafletsSushiController {
		params: GenericRequestParams;
		activePage: number;
		readonly titile: string;
		readonly trackingSource: string;
		pages: PagedList<LeafletFlightViewModel>[];
		visibleClass: string;
		displayAllClass: string;
		busy = false;

		/*@ngInject*/
		constructor(private api: ApiFactory, private trackingSourceService: TrackingSourceService, $scope: ng.IScope, private $state: ng.ui.IStateService,
			private userSettingsService:UserSettingsService, private apiConfig: ApiConfiguration) {
			this.pages = [];
			
			$scope.$watch(<any>angular.bind(this, () => this.params), val => {
                this.visibleClass = "hidden";
				this.pages = [];
				this.activePage = 0;

				if (val) {
					this.params = angular.extend(val, {
						limit: 6,
						offset: 0,
						as: "mobile"
					});
					this.displayAllClass = this.params.industryid ? "hidden" : "";

					this.fetchPage().then(res => {
						if (res.results.length > 0) this.visibleClass = "";
						this.fetchNextPage();
					});
				}
            });
		}

		private fetchNextPage() {
			if (this.pages[this.pages.length - 1].results.length >= this.params.limit) {
				this.params.offset += this.params.limit;
				this.fetchPage();
			}
		};

		private fetchPage() {
			this.busy = true;
			return this.api.leafletFlights.query(this.params).then((page: PagedList<LeafletFlightViewModel>) => {
				this.pages.push(page);
				this.params.offset = this.params.offset + page.skippedResults;
				for (var flight of page.results) {
					flight.imageUrl = this.api.leaflets.images(flight.mainLeafletId, "pages").xsmall(0);
				}
				this.busy = false;
				return page;
			});
		};

		goNext = () => {
			// check if we're at the end of preloaded leaflets
			// so we can preload on extra chunk
			if (this.pages.length - 1 == this.activePage + 1) {
				this.activePage++;
				this.fetchNextPage();
			} else {
				this.canNext() && this.activePage++;
			}
		}

		goPrevious = () => this.canPrevious() && this.activePage--;
		canNext = () => (this.activePage < this.pages.length - 1) && (this.pages[this.activePage+1].results.length > 0);
		canPrevious = () => this.activePage > 0;
		setSource = (flight: LeafletFlightViewModel) => {
			this.trackingSourceService.setSource(this.trackingSource);
			var location = this.userSettingsService.load().location || this.apiConfig.defaultLocation;
			this.api.leafletFlights.bestleaflet(flight.id, { 
				latitude: location.latitude, 
				longitude: location.longitude, 
				zipcode: location.zipCodes[0]}).then(leaflet => {
					var id = leaflet ? leaflet.id : flight.mainLeafletId;
					this.$state.go("leaflet.pageflip", {id: id, page: 0})
				});
		}
	}

	var directiveName = "mgLeafletsSushi";
	app.directive(directiveName, () => {
		return {
			scope:{},
			templateUrl: "sushi/LeafletsSushi.html",
			controller: LeafletsSushiController,
			controllerAs: "vm",
			bindToController: {
				params: `=${directiveName}`,
				title: `=?mgTitle`,
				trackingSource: "@source"
			}
		};
	});
}