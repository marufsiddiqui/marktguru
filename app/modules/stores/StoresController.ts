///<reference path="../../Application.ts"/>
///<reference path="../../core/Api.ts"/>
///<reference path="../../core/services/UserSettingsService.ts"/>

module Marktguru {
    export class StoresController {

		nearbyStoresParams: any;

		constructor(private userSettingsService: UserSettingsService, $stateParams, $scope: ng.IScope) {
			this.load($stateParams.id);
			$scope.$on(userSettingsService.changeEvent, () => this.load($stateParams.id));
		}

		load(id: number) {
			var settings = this.userSettingsService.load(),
				location = settings.location != null ? {
                    zipcode: settings.location.zipCodes[0],
                    latitude: settings.location.latitude,
                    longitude: settings.location.longitude
                } : null;
			this.nearbyStoresParams = angular.extend({ storechainid: id, limit: 60 }, location);
		}
    }

	app.controller("StoresController", StoresController);
}