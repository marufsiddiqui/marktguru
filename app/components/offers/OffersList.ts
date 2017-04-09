///<reference path="../../Application.ts"/>
///<reference path="../../core/Api.ts"/>
///<reference path="../../core/tracking/TrackingService.ts"/>

module Marktguru {
	interface IOffersListModel extends ng.IScope {
		topOffers: PagedList<OfferDetailed>;
		setSource: (id) => void;
	}

	var directiveName = "mgOffersList"
	app.directive(directiveName, (api: ApiFactory, trackingSourceService: TrackingSourceService, config: Configuration) => {
		"ngInject";
		return {
			scope: {
				params: `=${directiveName}`
			},
			templateUrl: "offers/OffersList.html",
			link: (scope: IOffersListModel) => {
				scope.$watch("params", (newVal) => {
					if(newVal) {
						api.offers.query(newVal).then(offersSuccess => {
							scope.topOffers = offersSuccess;

							for(var i = 0; i < scope.topOffers.results.length; i++) {
								var offer = scope.topOffers.results[i];
								if(offer.brand.name == config.noBrandName) delete offer.brand.name;
								offer.imageUrl = api.offers.images(offer.id, "default").small(0);
							}
			            });
					}
				});

				scope.setSource = () => {
					trackingSourceService.setSource(TrackingSources.homeOffers);
				}
			}
		}
	})
}