///<reference path="../../Application.ts"/>

module Marktguru {
    interface IFitscreenScope extends ng.IScope {
        styles: { width: string, display: string },
        level: number;
        focal: { x: number, y: number };
        aspect: number
    }
    app.directive("mgFitscreen", ($window: ng.IWindowService) => {
        return {
            template: `<div ng-style="styles"><ng-transclude></ng-transclude></div>`,
            transclude: true,
            scope: {
                aspect: "="
            },
            link: (scope: IFitscreenScope, element: ng.IAugmentedJQuery) => {
                var fixSize = (fit: boolean) => {
                    var height = document.body.clientHeight - 115;
                    var maxWidth = document.body.clientWidth - 22;
                    var width = height * scope.aspect - 12;
                    if (maxWidth < 100 || width < 100) return;
                    element[0].style["max-height"] = height + "px";
                    element[0].style["max-width"] = (fit ? width : maxWidth) + "px";
                    scope.styles.width = Math.min(width, maxWidth) + "px";
                    if (fit)
                        element[0].style["visibility"] = "visible";
                };

                scope.styles = { width: "auto", display: "inline-block" };
                fixSize(false);

                var onResize = () => {
                    fixSize(true); 
                    scope.$digest(); 
                };
                angular.element($window).on('resize', onResize);
                scope.$on('$destroy', () => {
                    angular.element($window).off('resize', onResize);
                });
            }
        }
    });
}