///<reference path="../../Application.ts"/>
///<reference path="../../core/Api.ts"/>

module Marktguru {
	interface IBrandsListModel extends ng.IScope {
		brandsList: PagedList<BrandDetailed>
	}

	var directiveName = "mgBrandsList";
	app.directive(directiveName, (api: ApiFactory) => {
		"ngInject";
		return {
			scope: {
				params: `=${directiveName}`
			},
			templateUrl: "brands-list/BrandsList.html",
			link: (scope: IBrandsListModel) => {
				scope.$watch("params", (newVal) => {
					if(newVal) {
						api.brands.query(newVal).then(brandsListSuccess => {
							scope.brandsList = brandsListSuccess;

							for(var i = 0; i < scope.brandsList.results.length; i++) {
								var brand = scope.brandsList.results[i];
								brand.imageUrl = api.brands.images(brand.id, "logos").small(0);
							}
						});
					}
				});
			}
		}
	})
}