///<reference path="../../Application.ts"/>
///<reference path="../../core/Api.ts"/>
///<reference path="../../core/services/GeolocationUtils.ts"/>

module Marktguru {
	class StoreViewModel extends Store{
		distance: number;
		imageUrl: string;
	}
	interface INearbyStoreModel extends ng.IScope {
		nearbyStores: StoreViewModel[];
		nearbyStoreTitle: string;
	}

	var directiveName = "mgNearbyStores";
	app.directive(directiveName, (api: ApiFactory, geolocationUtils: GeolocationUtils, apiConfig: ApiConfiguration, userSettingsService: UserSettingsService) => {
		"ngInject";
		return {
			scope: {
				params: `=${directiveName}`,
				title: "=mgStoreTitle",
				stores: "=mgStores",
				hideLink: "@",
				nearbyStoreTitle: "@mgTitle"
			},
			templateUrl: "nearby-stores/NearbyStores.html",
			link: (scope: INearbyStoreModel) => {
				scope.$watch("params", (newVal:any) => {
					if(newVal) {
						newVal.as = "mobile";
						api.stores.query(newVal).then(res => setModel(res.results));
					}
				}),
				scope.$watch("stores", (newVal:Store[]) => {
					if(newVal) {
						setModel(newVal);
					}
				}),
				scope.$watch("title", (newVal) => {
					if(newVal)
						scope.nearbyStoreTitle = newVal + " IN DEINER NÄHE";
					else
						scope.nearbyStoreTitle = scope.nearbyStoreTitle || "GESCHÄFTE IN DER NÄHE";
				});
				var setModel = (stores: Store[]) => {
					if(!stores || stores.length < 1) return;
					scope.nearbyStores = <any>stores;
					for (var store of scope.nearbyStores) {
						var settings = userSettingsService.load();
						var location = settings.location || apiConfig.defaultLocation;
							
						if(location) {
							store.distance = geolocationUtils.getDistance(new google.maps.LatLng(location.latitude, location.longitude),
								new google.maps.LatLng(store.location.latitude, store.location.longitude));
						} else {
							store.distance = 0;
						}

						store.imageUrl = api.storechains.images(store.storeChainId, "logos").small(0);
					}
					scope.nearbyStores = scope.nearbyStores.sort((x,y)=> x.distance - y.distance);
				};
			}
		}
	})
}