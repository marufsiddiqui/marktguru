///<reference path="../../Application.ts"/>
///<reference path="../../core/Api.ts"/>
///<reference path="PageFlipRouteState.ts"/>

module Marktguru {
	class Page {
		url: string;
		id: number;
	}

    export class PageflipIndexController {
		rows: Page[][] = [];

		constructor(public leaflet: LeafletDetailed, api: ApiFactory, private pageflipRouteState: PageflipRouteState) {

			var images = api.leaflets.images(leaflet.id, "pages");
			for (var i = 0; i <= leaflet.pageImages.count; i++){
				//this.pages.push({ id: i, url: images.small(i) });
				var row = Math.floor(i/2);
				if (!this.rows[row]) this.rows[row] = [];
				this.rows[row].push({ id: i, url: images.small(i-1) });
			}

		}

		exit() {
			this.pageflipRouteState.reset();
		}
    }

	app.controller("PageflipIndexController", PageflipIndexController);
}