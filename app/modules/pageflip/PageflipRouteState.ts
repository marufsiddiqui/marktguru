///<reference path="../../Application.ts"/>
///<reference path="../../core/tracking/TrackingService.ts"/>

module Marktguru {
    export class PageflipRouteState {
        lastState: ng.ui.IState
        params: {};

        constructor(private $state: ng.ui.IStateService, private $rootScope: ng.IScope, tracking: TrackingService, $window: ng.IWindowService) {
            $rootScope.$on('$stateChangeStart', (_event, toState: ng.ui.IState, _toParams, fromState: ng.ui.IState, fromParams) => {
                if(!toState.name || !fromState.name) return;
                if (toState.name.indexOf("leaflet.") >= 0 && fromState.name.indexOf("leaflet.") == -1) {
                    this.lastState = fromState;
                    this.params = fromParams;
                }
            });
            this.onStateExit(["leaflet."], (_, params) => { tracking.leafletClosed(+params.page); });
            this.onStateExit(["offerDetails", "root.search.offerDetails"], () => { tracking.offerClosed(); });

            $rootScope.$on('$stateChangeSuccess', () => {
                $window.scrollTo(0, 0);
            });
        }

        reset() {
            if (this.lastState && this.lastState.name) {
                this.$state.go(this.lastState.name, this.params);
            } else {
                this.$state.go("root.home");
            }
        }


        private onStateExit(names: string[], callback: (fromState, fromParams) => void) {
            this.$rootScope.$on('$stateChangeStart', (_event, toState: ng.ui.IState, _toParams, fromState: ng.ui.IState, fromParams) => {
                if(!toState.name || !fromState.name) return;
                for (var name of names) {
                    if (fromState.name.indexOf(name) >= 0 && toState.name.indexOf(name) == -1) {
                        callback(fromState, fromParams);
                    }
                }
            });
        }
    }

    app.service("pageflipRouteState", PageflipRouteState);
    app.run((pageflipRouteState: PageflipRouteState) => { pageflipRouteState;});
}