///<reference path="../../Application.ts"/>
///<reference path="../../core/Api.ts"/>
///<reference path="../../core/tracking/TrackingService.ts"/>

module Marktguru {
	export class SearchController {
		query: string;
		results: any;
		offerParams: {};

		constructor($stateParams, search: PagedList<SearchResult>, private tracking: TrackingService, private trackingSourceService: TrackingSourceService) {
			this.query = $stateParams.query;
			this.results = search;
			this.offerParams = {
				query: this.query,
				results: this.results.results
			};
			this.tracking.search(this.query, this.results.results.length > 0 ? "advertisements" : "noResults", this.results.totalResults);
			this.trackingSourceService.setSource(this.results.results.length > 0 ? TrackingSources.searchResult : TrackingSources.searchNoResult);
		}
	}
	app.controller("SearchController", SearchController);
}