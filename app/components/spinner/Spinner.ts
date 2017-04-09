///<reference path="../../Application.ts"/>
///<reference path="../../core/Api.ts"/>

module Marktguru {
	class SpinnerController {
		show = false;
		/*@ngInject*/
		constructor($scope: ng.IScope) {
            $scope.$on("cfpLoadingBar:started", () => {
                this.show = true;
            });
            $scope.$on("cfpLoadingBar:completed", () => {
                this.show = false;
            });
		}
	}

	app.directive("mgSpinner", () => {
		"ngInject";
		return {
			bindToController: {
			},
			templateUrl: "spinner/Spinner.html",
			controller: SpinnerController,
			controllerAs: "vm"
		}
	});
}