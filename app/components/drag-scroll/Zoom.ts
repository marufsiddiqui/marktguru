///<reference path="../../Application.ts"/>

module Marktguru {

	declare var Hammer: any;
	interface IZoomScope extends ng.IScope {
		onZoom: ({active: boolean}) => void;
		control: {};
		controller: { zoomInOut: (action: boolean) => void};
	}

	app.directive("mgZoom", ($timeout: ng.ITimeoutService) => {
		return {
			scope: {
				onZoom: "&",
				control: '='
			},
			link: ($scope: IZoomScope, element: ng.IAugmentedJQuery) => {
				var zoomActive = false;
				var notify = (noApply = true) => {
					if(scale > 1 && !zoomActive){
						$scope.onZoom({active: true});
						zoomActive = true; 
						noApply && $scope.$apply();
					}
					if(scale <= 1 && zoomActive){
						 $scope.onZoom({active: false});
						 zoomActive = false;
						 posX = 0;
						posY = 0;
						last_scale = 1;
						last_posX = 0;
						last_posY = 0;
						noApply && $scope.$apply();
					}
				};
				var animate = () => {
						el.style.transition = "0.2s linear all";
						$timeout(() => {el.style.transition = "";}, 200);
				}

				$scope.$on("mgzoom:zoom",(_event, action) => {
					if(action) {
						transform =
							"translate3d(0, 0, 0) " +
							"scale3d(3, 3, 1) ";
						scale = 3;
						last_scale = 3;
					}else {
						transform =
							"translate3d(0, 0, 0) " +
							"scale3d(1, 1, 1) ";
						scale = 1;
						last_scale = 1;
					}
					el.style.webkitTransform = transform;
					el.style.transform = transform;
					animate();
					transform = "";
					notify(false);
				});

				 var elm = element[0];
				var hammertime = new Hammer(elm, {});
				hammertime.get('pinch').set({
					enable: true
				});
				hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });

				//elm.style.transition = "0.1s all linear"
				var posX = 0,
					posY = 0,
					scale = 1,
					last_scale = 1,
					last_posX = 0,
					last_posY = 0,
					max_pos_x = 0,
					max_pos_y = 0,
					transform = "",
					el = elm;

				addWheelListener(elm, (ev) => {
					if(ev.deltaX != 0) return;
					
					ev.preventDefault();
					var newScale = Math.round(ev.deltaY < 0 ? last_scale + 1 : last_scale - 1);
					scale = newScale <= 1 ? 0.999 : Math.min((newScale), 4);					
					
					if(Math.abs(scale- last_scale)> 0.5) {
						
						posX = last_posX + ((scale > last_scale) ?  (window.innerWidth/2 - (ev.clientX || ev.originalEvent.clientX)) : -1*(last_posX/scale));
						posY = last_posY + ((scale > last_scale) ? (window.innerHeight/2 - (ev.clientY || ev.originalEvent.clientY)) : -1*(last_posY/scale));
						if(scale <= 1){
							posX = 0;
							posY = 0;
						}
						last_posX = posX;
						last_posY = posY;
					}					
					if (scale != 1) {
						transform =
							"translate3d(" + posX + "px," + posY + "px, 0) " +
							"scale3d(" + scale + ", " + scale + ", 1)";
					}

					if (transform) {
						el.style.webkitTransform = transform;
						el.style.transform = transform;
						animate();
					}
					last_scale = scale;
					notify();
					return false;
				}, false);

				hammertime.on('doubletap pan pinch panend pinchend', function (ev) {
					if (ev.type == "doubletap") {
						posX =  (window.innerWidth/2 - ev.center.x)*2;
						
						posY = (window.innerHeight/2 - ev.center.y)*2;
						last_posX = posX;
						last_posY = posY;
						transform =
							"translate3d(" + posX + "px," + posY + "px, 0) " +
							"scale3d(3, 3, 1) ";
						scale = 3;
						last_scale = 3;
						
						if(zoomActive) {
							transform =
								"translate3d(0, 0, 0) " +
								"scale3d(1, 1, 1) ";
							scale = 1;
							last_scale = 1;
							last_posX = 0;
							last_posY = 0;
							notify();
						}
						
						el.style.webkitTransform = transform;
						el.style.transform = transform;
						animate();
						transform = "";
					}

					//pan    
					if (scale != 1) {
						posX = last_posX + ev.deltaX;
						posY = last_posY + ev.deltaY;
						max_pos_x = Math.ceil((scale - 1) * el.clientWidth / 2);
						max_pos_y = Math.ceil((scale - 1) * el.clientHeight / 2);
						if (posX > max_pos_x) {
							posX = max_pos_x;
						}
						if (posX < -max_pos_x) {
							posX = -max_pos_x;
						}
						if (posY > max_pos_y) {
							posY = max_pos_y;
						}
						if (posY < -max_pos_y) {
							posY = -max_pos_y;
						}
					}

					//pinch
					if (ev.type == "pinch") {
						scale = Math.max(.999, Math.min(last_scale * (ev.scale), 4));
					}
					if (ev.type == "pinchend") { last_scale = scale; }

					//panend
					if (ev.type == "panend") {
						last_posX = posX < max_pos_x ? posX : max_pos_x;
						last_posY = posY < max_pos_y ? posY : max_pos_y;
					}

					if (scale != 1) {
						transform =
							"translate3d(" + posX + "px," + posY + "px, 0) " +
							"scale3d(" + scale + ", " + scale + ", 1)";
					}

					if (transform) {
						notify();
						el.style.webkitTransform = transform;
						el.style.transform = transform;
					}
				});

				$scope.$on('$destroy', () => {
                    hammertime.destroy();
                });
			}
		};
	});
}