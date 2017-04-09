///<reference path="../../Application.ts"/>
///<reference path="../../core/Api.ts"/>
///<reference path="../../core/services/UserSettingsService.ts"/>
///<reference path="PageFlipRouteState.ts"/>
///<reference path="../../core/tracking/TrackingService.ts"/>

module Marktguru {
	class Page {
		url: string;
		offers: LeafletChild[];
		index: number;
	}

    export class PageflipController {
		readonly pageIndex: number;
		pageNumber: string;
		readonly images: ImageApi;
		readonly left?: Page;
		readonly right?: Page;
		colCount = 2;
		readonly first:boolean = false;
		readonly last:boolean = false;
		showInfoBox = false;

		constructor(public leaflet: LeafletDetailed, $stateParams, api: ApiFactory, private $state: ng.ui.IStateService, public store: Store,
			matchmedia, private userSettingsService: UserSettingsService, private $timeout: ng.ITimeoutService,
			private pageflipRouteState: PageflipRouteState, private tracking: TrackingService, private $scope: ng.IScope) {
			this.images = api.leaflets.images(leaflet.id, "pages");
			this.pageIndex = +$stateParams.page;
			var index = this.roundIndex(this.pageIndex);

			this.first = index == 0;
			this.last = this.pageIndex >= leaflet.pageImages.count-1; //(index == this.roundIndex(leaflet.pageImages.count)) || (index == leaflet.pageImages.count-1);
			
			this.left = this.getPage(index - 1);
			this.right = this.getPage(index);
			if(this.first) $timeout(() => { if(this.right) this.right.url = this.images.medium(index); }, 10);
			matchmedia.on("(min-width: 992px)", (mqList) => {
				this.colCount = mqList.matches ? 2 : 1;

				this.pageNumber = this.colCount == 1 ? `${this.pageIndex + 1}` : `${index}-${index + 1}`;
				if (index == 0) this.pageNumber = "1";
				if (index >= this.leaflet.pageImages.count) this.pageNumber = `${this.leaflet.pageImages.count}`;
				if(!this.last){
				  var img = new Image(); img.src = this.images.medium(index+1);
				  if(this.colCount == 2 && index+2 < leaflet.pageImages.count) {
					  img = new Image(); 
					  img.src = this.images.medium(index+2);
				  }
				}
			});

			this.hideMenu = userSettingsService.load().hidePageflipMenu;
			this.tracking.leafletOpened(leaflet, this.pageIndex);

			 $scope.$on("mg:keyup", (_event, data: JQueryEventObject) => {
        		if(data.keyCode == 39) this.next(true);
				if(data.keyCode == 37) this.prev(true);
				if(data.keyCode == 27) this.exit();
    		});
		}

		next(click) {
			if (!click && this.zoom) return;
			!this.last && this.navigate(this.roundIndex(this.pageIndex + this.colCount));
		}

		prev(click) {
			if (!click && this.zoom) return;
			!this.first && this.navigate(this.roundIndex(this.pageIndex - this.colCount));
		}

		exit() {
			this.pageflipRouteState.reset();
		}

		infoBox(show: boolean) {
			this.showInfoBox = show;
		}

		private roundIndex(index: number) {
			return Math.round(index / this.colCount) * this.colCount;
		}

		private navigate(index: number) {
			this.tracking.pageShow(this.colCount);
			this.$state.go("leaflet.pageflip", { id: this.leaflet.id, page: index });
		}

		private getPage(index: number) {
			if (index < 0 || index >= this.leaflet.pageImages.count) return undefined;
			return {
				url: this.first ? this.images.xsmall(index) : this.images.medium(index),
				offers: this.leaflet.children.filter(child => child.pageIndex == index),
				index: index
			}
		}

		zoom = false;
		focal: any = { x: 0, y: 0 };

		zoomInOut() {
			this.$scope.$broadcast("mgzoom:zoom", !this.zoom);
		}

		onZoom(active) {
			this.zoom = active;
			if(active){
				this.loadExtraLarge(this.left);
				this.loadExtraLarge(this.right);
			}
		}

		private loadExtraLarge(page?: Page) {
			if (page && page.url.indexOf("xlarge") < 0) {
				this.$timeout(() => {
					page.url = this.images.xlarge(page.index);
				}, 200);
			}
		}

		private hideMenu: boolean;
		private tapInprogress?: ng.IPromise<any>;
		public toggleMenu() {
			if (this.tapInprogress) { // double tap detected
				this.$timeout.cancel(this.tapInprogress);
				this.tapInprogress = undefined;
				return;
			}

			this.tapInprogress = this.$timeout(() => {
				this.hideMenu = !this.hideMenu;
				var settings = this.userSettingsService.load();
				settings.hidePageflipMenu = this.hideMenu;
				this.userSettingsService.save(settings);
				this.tapInprogress = undefined;
			}, 300);
		}
    }

	app.controller("PageflipController", PageflipController);
}