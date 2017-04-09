/// <reference path="../../Application.ts"/>

module Marktguru {

	interface IHideKeyboardScope extends ng.IScope {
		flag: boolean
	}

	var directiveName = "mgHideKeyboard";
	app.directive(directiveName, () => {
		return {
			scope: { flag: `=${directiveName}` },
			link: (scope: IHideKeyboardScope, element) => {
				var input = element[0];
				scope.$watch("flag", (val) => {
					if (val) {
						input.setAttribute('readonly', 'readonly'); // Force keyboard to hide on input field.
						input.setAttribute('disabled', 'true'); // Force keyboard to hide on textarea field.
						setTimeout(function() {
							input.blur();  //actually close the keyboard
							// Remove readonly attribute after keyboard is hidden.
							input.removeAttribute('readonly');
							input.removeAttribute('disabled');
						}, 100);
						scope.flag = false;
					}
				})
			}
		}
	});

}