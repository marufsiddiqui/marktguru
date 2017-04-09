/// <reference path="../../Application.ts"/>

module Marktguru {
    app.directive('selectOnClick', ['$window', ($window) => {
    	return {
			restrict: 'A',
			link: (_scope, element) => {
				element.on('click', function (this:any) {
					if (!$window.getSelection().toString()) {
						// Required for mobile Safari
						this.setSelectionRange(0, this.value.length)
					}
				});
			}
    	};
	}]);
}