///<reference path="../../Application.ts"/>
///<reference path="../../core/Api.ts"/>

module Marktguru {
    export class ApplicationController {

		locationHolderClass: string;
		menuClass: string;
		year: number;

		constructor($scope: ng.IScope) {
			this.menuClass = "";
			this.locationHolderClass = "";
			$scope.$on("$stateChangeSuccess", () => { this.menuClass = ""; });
			$scope.$on("mg:close-menu", () => { this.menuClass = ""; });

			// for footer
			this.year = (new Date()).getFullYear();
		}

		public toggleClass() {
			this.menuClass === "" ? this.menuClass = "active" : this.menuClass = "";
		}

		public toggleLocationHolderClass() {
			this.locationHolderClass === "" ? this.locationHolderClass = "active" : this.locationHolderClass = "";
		}
	}
	app.controller("ApplicationController", ApplicationController)
}