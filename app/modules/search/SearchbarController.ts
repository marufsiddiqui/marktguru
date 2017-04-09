///<reference path="../../Application.ts"/>
///<reference path="../../core/Api.ts"/>

module Marktguru {
	export class SearchbarController {
		query: string;
		hidekeyboard = false;

		constructor(private $state: ng.ui.IStateService, private api: ApiFactory, $stateParams, $scope: ng.IScope) {
			this.query = $stateParams.query || "";
			$scope.$on('$stateChangeStart', (_event, toState: ng.ui.IState, toParams) => {
				if (toState.name == "root.search.results")
					this.query = toParams.query
			});
		}

		submit() {
			this.hidekeyboard = true;
			this.$state.go("root.search.results", { query: this.query });
		}

		suggest(query: string) {
			return this.api.advertisments.suggestions({ q: query });
		};
	}
	app.controller("SearchbarController", SearchbarController);
}