///<reference path="../../Application.ts"/>
///<reference path="../../core/Api.ts"/>
///<reference path="../../core/tracking/TrackingService.ts"/>

module Marktguru {
	class OffersBarController {
		params: GenericRequestParams;
		offers: PagedList<OfferDetailed>;
		title: string;
		showPagination = false;
		visibleClass = "hidden";
		source: string;
		lazyloadTimes = 0;
		private maxLazyloadTimes = 3;
		busy = false;
		/*@ngInject*/
		constructor(private api: ApiFactory, private trackingSourceService: TrackingSourceService, $scope: ng.IScope,
			private config: Configuration, private $window: ng.IWindowService) {
			this.title = this.title || "ANGEBOTE"
			$scope.$watch<GenericRequestParams>(<any>angular.bind(this, () => this.params), val => {
				if (val) {
					val.offset = 0; this.lazyloadTimes = 0;
					this.load().then(offers => {
						this.visibleClass = offers.results.length > 0 ? "" : "hidden";
					})
				}
			});
		}

		loadMore() {
			if(this.busy) return;
			if (this.isLastPage()) return;
			if (this.lazyloadTimes < this.maxLazyloadTimes) {
				this.params.offset += this.params.limit + this.offers.skippedResults;
				this.lazyloadTimes++;
				this.load(true);
			} else {
				if (!this.showPagination) {
					//this.params.limit = this.maxLazyloadTimes * this.params.limit;
					this.showPagination = true;
				}
			}
		}

		loadPage(next: boolean) {
			if(this.busy) return;
			var direction = next ? 1 : -1;
			this.params.offset += direction * (this.params.limit + this.offers.skippedResults);
			this.load();
			this.$window.scrollTo(0, 0);
		}

		next = () => !this.isLastPage() && this.loadPage(true);
		prev = () => (this.params.offset >= this.params.limit) && this.loadPage(false);
		setSource = () => this.trackingSourceService.setSource(this.source);
		private isLastPage = () => (this.offers.results.length % this.params.limit) > 0;

		private load(append: boolean = false) {
			this.busy = true;
			return this.api.offers.query(this.params).then(res => {
				for (var offer of res.results) {
					offer.imageUrl = this.api.offers.images(offer.id, "default").small(0);
					if(offer.brand.name == this.config.noBrandName) delete offer.brand.name;
					if (append) this.offers.results.push(offer);
				}
				if (!append) this.offers = res;
				this.busy = false;
				return this.offers;
			})
		}
	}

	app.directive("mgOffersBar", () => {
		"ngInject";
		return {
			scope:{},
			bindToController: {
				params: `=mgOffersBar`,
				title: `=?mgTitle`,
				offersType: `=mgOfferBarType`,
				source: "@"
			},
			templateUrl: (_, attr) => (attr.mgOfferBarType == "lazyload") ? "offers/OffersBarLazyload.html" : "offers/OffersBar.html",
			controller: OffersBarController,
			controllerAs: "vm"
		}
	});
}