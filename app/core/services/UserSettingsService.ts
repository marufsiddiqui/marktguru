///<reference path="../../Application.ts"/>
///<reference path="../model/Location.ts"/>
///<reference path="../Api.ts"/>

module Marktguru {

    export class LocalStoreService {
        get<T>(key: string): T|null {
            var value = localStorage.getItem(key) || "";
			try {
				return JSON.parse(value);
			} catch (err) {
				return null;
			}
        }
        set(key: string, value: any) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }

    app.service("localStorage", LocalStoreService);

	export class UserSettings {
		location: Location;
		locationSource: string;
		hidePageflipMenu = false;
	}

	export class UserSettingsService {
		private key = "mg:user-settings";
		public changeEvent = "mg:settings-change"
		constructor(private localStorage: LocalStoreService, private $rootScope: ng.IScope, private apiConfig: ApiConfiguration) { }
		load(): UserSettings {
			var settings = this.localStorage.get<UserSettings>(this.key) || new UserSettings();
			if(!settings.location) { 
				settings.location = angular.copy(this.apiConfig.defaultLocation);
				settings.locationSource = "fallback";
			}
			return settings;
		}
		save(settings: UserSettings) {
			this.localStorage.set(this.key, settings);
			this.$rootScope.$broadcast(this.changeEvent);
		}
	}
    app.service("userSettingsService", UserSettingsService);
}