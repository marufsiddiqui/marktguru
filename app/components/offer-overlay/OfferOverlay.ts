/// <reference path="../../Application.ts"/>
/// <reference path="../../core/Api.ts" />
/// <reference path="../../core/tracking/TrackingService.ts" />

module Marktguru {

	class OfferIcon {
		styles: {};
		constructor(coordinates: Coordinates, public offer: OfferDetailed) {
			this.styles = {
				left: coordinates.fromX * 100 + "%",
				top: coordinates.fromY * 100 + "%"
			}
		}
	}

    class OfferOverlayController {
		offers: LeafletChild[];
		icons: OfferIcon[] = [];
		inProgress: ng.IPromise<any> | undefined;

		/*@ngInject*/
        constructor(private $scope: ng.IScope, api: ApiFactory, private $window: ng.IWindowService, private $timeout: ng.ITimeoutService) {
			$scope.$watch(<any>angular.bind(this, () => this.offers), (value: LeafletChild[]) => {
				if(!value) return;
				var offers = {};
				for(var child of value){
					offers[+child.id.split("/")[1]] = child.coordinates;
				}
				var ids = Object.keys(offers);
				if(ids.length <= 0) return;
				api.offers.getMany(<any>ids).then(res => {
					for(var offer of res.results) {
						if(offer.externalUrl)
							this.icons.push(new OfferIcon(offers[offer.id], offer))
					}
				});
			});
		}

		navigate(offer: OfferDetailed) {			
			if(this.inProgress) { this.$timeout.cancel(this.inProgress); this.inProgress = undefined; }
			this.$scope.$emit("mg:events:clickout", {
				advertisment: offer,
				name: `${offer.brand.name} ${offer.product.name}`,
				type: "offer",
				url: offer.externalUrl
			});
			this.$window.open(offer.externalUrl, "_blank");
		}
    }

	var directiveName = "mgOfferOverlay";

	app.directive(directiveName, () => {
		return {
			scope: {},
			templateUrl: `offer-overlay/OfferOverlay.html`,
			controller: OfferOverlayController,
			controllerAs: "vm",
			transclude: true,
			bindToController: {
				offers: `=${directiveName}`,
				inProgress: "="
			}
		};
	});

}