///<reference path="../../Application.ts"/>
///<reference path="../../core/Api.ts"/>
///<reference path="../../core/tracking/TrackingService.ts"/>

module Marktguru {
    export class OfferDetailsController {

		id: number;
		offer: OfferDetailed;
		imageUrl: string;
		retailerImageUrl: string;
		discountPercentage: number;
		index: number;
		showNext = false;
		showPrev = false;
		notFound = false;
		stores: Store[]|undefined;
		storesTitle = "Store next to you";

		constructor(private $stateParams, private api: ApiFactory, private search: PagedList<SearchResult>, private $state: ng.ui.IStateService, private tracking: TrackingService,
			private $scope: ng.IScope, userSettingsService: UserSettingsService) {
			if (search) {
				for(var i = 0; i < search.results.length; i++) {
					if(search.results[i].data.id == +$stateParams.id) {
						this.index = i;
						break;
					}
				}
				if(!this.index) this.index = 0;
				this.id = +$stateParams.id;
				this.showNext = search.results.length > this.index + 1;
				this.showPrev = this.index > 0;				
				$scope.$on("mg:keyup", (_event, data: JQueryEventObject) => {
        			if(data.keyCode == 39) this.next();
					if(data.keyCode == 37) this.prev();
    			});
			} else {
				this.id = $stateParams.id;
			}
			api.offers.get(this.id, true).then(offer => this.onOfferLoad(offer), () => this.notFound = true);

			var settings = userSettingsService.load();
			api.offers.stores(this.id, settings.location).then(res => {
				this.stores = res ? res.results : undefined;
			})
		}

		private onOfferLoad(offer: OfferDetailed) {
			this.offer = offer;

			if (this.offer.images.count > 0) {

				// getting product image
				var imageApi: ImageApi;
				if (this.offer.imageType === "offer") {
					imageApi = this.api.offers.images(this.offer.id, "default")
				} else {
					imageApi = this.api.products.images(this.offer.id, "default")
				}
				this.offer.imageUrl = imageApi.large(0);
			}

			// getting product advertiser image
			var retailerId: string[] = this.offer.advertisers[0].id.split("/");
			var retailerImageApi: ImageApi;

			if (retailerId[0] === "retailers") {
				retailerImageApi = this.api.retailers.images(+retailerId[1], "logos");
			} else {
				retailerImageApi = this.api.brands.images(+retailerId[1], "logos");
			}

			this.retailerImageUrl = retailerImageApi.small(0);
			if (this.offer.oldPrice && this.offer.oldPrice > 0)
				this.discountPercentage = 100 - (this.offer.price / this.offer.oldPrice * 100);
			this.tracking.offerOpened(this.offer);
		}

		next() {
			this.showNext && this.navigate(this.index + 1);
		}

		prev() {
			this.showPrev && this.navigate(this.index - 1);
		}

		back() {
			if(this.$stateParams.query) this.$state.go("root.search.results", { query: this.$stateParams.query });
			else window.history.back();
		}

		clickout(){
			this.$scope.$emit("mg:events:clickout", {
				advertisment: this.offer,
				name: `${this.offer.brand.name} ${this.offer.product.name}`,
				type: "offer",
				url: this.offer.externalUrl
			});
		}

		private navigate(index: number) {
			this.tracking.offerClosed();
			this.$state.go("root.search.offerDetails", { query: this.$stateParams.query, id: this.search.results[index].data.id });
		}
    }

	app.controller("OfferDetailsController", OfferDetailsController);
}