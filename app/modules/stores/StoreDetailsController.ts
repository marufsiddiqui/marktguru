///<reference path="../../Application.ts"/>
///<reference path="../../core/Api.ts"/>
///<reference path="../../core/services/GeolocationUtils.ts"/>
///<reference path="../../core/services/UserSettingsService.ts"/>
///<reference path="../../core/model/Common.ts"/>

module Marktguru {
    export class StoreDetailsController {

		id: number;
		store: Store;
		openIntervals?: WorkingHours[];

		distance: number;
		storeLatLon: any;
		storeChain: Store;
		nearbyStoresParams: any;

		constructor($stateParams, private geolocationUtils: GeolocationUtils, api: ApiFactory,
			private userSettingsService: UserSettingsService, private apiConfig: ApiConfiguration,
			$scope: ng.IScope) {

			this.id = $stateParams.id;

			api.stores.getOpenIntervals(this.id, this.daysRange(10)).then(res => {
				this.openIntervals = res;
			});

			api.stores.get(this.id, false).then(storeSuccess => {
				this.store = storeSuccess;

				this.storeLatLon = new google.maps.LatLng(this.store.location.latitude, this.store.location.longitude);
				var center = this.storeLatLon;
				var mapOptions = {
			        zoom: 15,
			        center: this.storeLatLon,
			        mapTypeId: google.maps.MapTypeId.TERRAIN,
					scrollwheel: false
			    }
				var map = new google.maps.Map(document.getElementById('map'), mapOptions);
				google.maps.event.addListenerOnce(map, 'idle', function() {
   					google.maps.event.trigger(map, 'resize');
					map.setCenter(center);
				});
				new google.maps.Marker({
		            map: map,
		            position: this.storeLatLon,
		            title: this.store.name,
					icon: './assets/icons/map_pin.svg'
		        });

				this.setNearbyStoresParams();
				$scope.$on(userSettingsService.changeEvent, () => this.setNearbyStoresParams());

				api.storechains.get(this.store.storeChainId, false).then(chain => {
					this.storeChain = chain;
				});
			});
		}

		private setNearbyStoresParams() {
			var settings = this.userSettingsService.load(),
				location = settings.location != null ? {
                    zipcode: settings.location.zipCodes[0],
                    latitude: settings.location.latitude,
                    longitude: settings.location.longitude
                } : null;
			var userLocation = location || this.apiConfig.defaultLocation;
			this.distance = this.geolocationUtils.getDistance(new google.maps.LatLng(userLocation.latitude, userLocation.longitude), this.storeLatLon);
			// get stores nearby
			this.nearbyStoresParams = angular.extend({
				limit: 6,
				storeChainId: this.store.storeChainId
			}, location);
		}

		private daysRange(count: number) {
			var result: Date[] = [];
			for(var i = 0; i < count; i++){
				var date = new Date();
				date.setDate(date.getDate()+i);
				result.push(date);
			}
			return result;
		}

		// private getUserDistanceFromStore(position): number {
		// 	var userLatLon = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		// 	return this.geolocationUtils.getDistance(userLatLon, this.storeLatLon);
        // }
    }

	app.controller("StoreDetailsController", StoreDetailsController);
}