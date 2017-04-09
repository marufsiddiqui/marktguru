///<reference path="../../Application.ts"/>
///<reference path="../../core/Api.ts"/>

module Marktguru {
	interface IStoreInfoModel extends ng.IScope {
		img: string;
		displayLinks: any[];
		showLinks: boolean;
	}

	var directiveName = "mgStoreInfo"
	app.directive(directiveName, (api: ApiFactory) => {
		"ngInject";
		return {
			scope: { 
				store: `=${directiveName}`,
				showLinks: "=links"
			},
			templateUrl: "store-info/StoreInfo.html",
			link: (scope: IStoreInfoModel) => {
				var labels = {
					homePage: "Webseite",
					onlineShop: "Online shop",
					facebook: "Facebook",
					twitter: "Twitter",
					google: "Google+",
					pInterest: "Pinterest",
					tumbler: "Tumbler",
					youtube: "Youtube"
				}
				scope.$watch("store", (newVal: Store) => {
					if(newVal) {
						scope.img = api.storechains.images(newVal.storeChainId, "logos").small(0);
						scope.displayLinks = [];
						if(scope.showLinks) {
							for(var key of Object.keys(labels)) {
								var link = newVal.links[key];
								if(link && link.url){
									scope.displayLinks.push({
										displayText: labels[key],
										url: link.url
									});
								}
								if(scope.displayLinks.length > 2) break;
							}
						}
					}
				});

				scope.clickout = (url: string) => {
					scope.$emit("mg:events:clickout", {
						advertisment: {id: scope.store.id},
						name: scope.store.name,
						type: "store",
						url: url
					});
				}
			}
		}
	})
}