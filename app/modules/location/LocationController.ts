///<reference path="../../Application.ts"/>
///<reference path="../../core/Api.ts"/>
///<reference path="../../core/services/UserSettingsService.ts"/>

module Marktguru {
    export class LocationController {
		infoBox: boolean;		
		settings: UserSettings;

		constructor(private api: ApiFactory, private userSettingsService: UserSettingsService, private $q: ng.IQService,
			$scope: ng.IScope, private apiConfig: ApiConfiguration) {
			this.settings = userSettingsService.load();
			if(this.settings.locationSource == "fallback") this.formatName(this.settings.location);
			$scope.$on("$stateChangeStart", () => { this.infoBox = false; });
			$scope.$on("mg-location-detect", () => {
				this.detect();
			});
		}

		save() {
			this.infoBox = false;		
			this.addCoordinates(this.settings.location).then(() => {
				this.settings.locationSource = "manual";
				this.userSettingsService.save(this.settings);				
			});
		}

		detect() {
			this.infoBox = false;			
			this.api.locations.current().then(current => {
				if(!current) return;
				var location = current.results.length > 0 ? current.results[0] : this.apiConfig.defaultLocation;
				this.settings.location = angular.copy(location);
				this.formatName(this.settings.location);
				this.save();
			});
		}

		suggest(query: string){
			this.infoBox = false;
			return this.suggestSmall(query);
			
		};

		suggestSmall(query: string){
			return this.api.locations.query({ q: query, limit: 10 }).then(locations => {
				for(var location of locations.results){
					this.formatName(location);
				}
				return locations.results;
			});
		};

		private addCoordinates(location: Location) {
            var defered = this.$q.defer<Location>();
			if(location.latitude && location.longitude){
				defered.resolve(location);
				return defered.promise;
			}
            var geocoder = new google.maps.Geocoder();
            var zip = location.zipCodes[0];
            geocoder.geocode({ address: `${location.country} ${location.name} ${zip}` }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    location.latitude = results[0].geometry.location.lat();
                    location.longitude = results[0].geometry.location.lng();
                }
                defered.resolve(location);
            });
            return defered.promise;
        }

		private formatName(location: Location) {
			location.name = `${location.name} (${location.zipCodes[0]})`
		}
	}

	app.controller("LocationController", LocationController);

	class LocationDisclamerController {
		private disclamer = false;
		constructor(userSettingsService: UserSettingsService, $scope: ng.IScope, private $rootScope: ng.IScope) {
            var settings = userSettingsService.load();
			if(settings.locationSource == "fallback") this.disclamer = true;
            $scope.$on(userSettingsService.changeEvent, () => this.disclamer = false);
        }
		
		detect() {
			this.$rootScope.$broadcast("mg-location-detect");
		}
	}
	app.controller("LocationDisclamerController", LocationDisclamerController);
}