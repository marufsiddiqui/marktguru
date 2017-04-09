///<reference path="../../Application.ts"/>
///<reference path="../../core/Api.ts"/>
///<reference path="../../core/tracking/TrackingService.ts"/>

module Marktguru {
	interface ISearchOfferModel extends ng.IScope {

		offers: any[];
		offersPage: any[];
		query: string;
		showPagination: boolean;
		activePaginationPage: number;

		paginationNext();
		paginationPrev();
		getPaginationRange();
		setSource: () => void;
		getOffset: () => number;
		canNext: () => boolean;
		canPrev: () => boolean;
	}

	var directiveName = "mgSearchOffer";
	app.directive(directiveName, (api: ApiFactory, config: Configuration, $window: ng.IWindowService) => {
		"ngInject";
		return {
			scope: {
				params: `=${directiveName}`
			},
			templateUrl: "search/SearchOffer.html",
			link: (scope: ISearchOfferModel) => {

				var pageSize = 20;
				scope.showPagination = false;

				var numberOfPages = 0;

				scope.$watch("params", (newVal: any) => {
					if(newVal) {

						scope.offers = new Array();
						scope.offersPage = new Array();

						scope.activePaginationPage = 1;

						scope.query = newVal.query;
						for(var i = 0; i < newVal.results.length; i++) {
							var offer = newVal.results[i];

							if(offer.type == "offers") {
								offer.data.imageUrl = api.offers.images(offer.data.id, "default").small(0);
								if(offer.data.brand.name == config.noBrandName) delete offer.data.brand.name;
								scope.offers.push(offer.data);

								if(i < pageSize)
									scope.offersPage.push(offer.data);
							}

						}
						numberOfPages = scope.offers.length / pageSize;
						if(scope.offers.length > pageSize) {
							scope.showPagination = true;
						}

					}
				});

				scope.canNext = () => scope.activePaginationPage < numberOfPages;
				scope.paginationNext = () => {
					if(scope.canNext()) {

						var lowerLimit = scope.activePaginationPage * pageSize;
						scope.activePaginationPage++
						var upperLimit = scope.activePaginationPage * pageSize;

						if(upperLimit > scope.offers.length)
							upperLimit = scope.offers.length;

						scope.offersPage = new Array();

						for(var i = lowerLimit; i < upperLimit; i++) {
							scope.offersPage.push(scope.offers[i]);
						}
 						$window.scrollTo(0, 0);
					}
				};

				scope.canPrev = () => scope.activePaginationPage >= 2;
				scope.paginationPrev = () => {
					if(scope.canPrev) {

						scope.activePaginationPage--
						var upperLimit = scope.activePaginationPage * pageSize;
						var lowerLimit = (scope.activePaginationPage - 1) * pageSize;

						scope.offersPage = new Array();

						for(var i = lowerLimit; i < upperLimit; i++) {
							scope.offersPage.push(scope.offers[i]);
						}
 						$window.scrollTo(0, 0);
					}
				};

				scope.getPaginationRange = () => {
					var arr = new Array()
					if(scope.offers) {
						for(var i = 1; i <= numberOfPages; i++) {
							arr.push(i);
						}
					}

					return arr;
				}

				scope.getOffset = () => (scope.activePaginationPage-1)*pageSize;

			}
		}
	})
}