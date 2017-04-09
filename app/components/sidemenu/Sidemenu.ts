///<reference path="../../Application.ts"/>
///<reference path="../../core/Api.ts"/>

module Marktguru {
	interface ISidemenuModel extends ng.IScope {
		menuClass: string;

		showCategories: boolean;
		showBrands: boolean;

		toggleClass(title: string);

		topCategories: NamedItem[];
		topBrands: NamedItem[];
		close: () => void;
	}

	class NamedItem {
		name: string;
	}

	var directiveName = "mgSidemenu"
	var directiveClass = "mgMenuClass"
	app.directive(directiveName, () => {
		"ngInject";
		return {
			scope: {
				params: `=${directiveName}`,
				"class": `=${directiveClass}`
			},
			templateUrl: "sidemenu/Sidemenu.html",
			replace: true,
			link: (scope: ISidemenuModel) => {

				scope.showCategories = true;
				scope.showBrands = true;
				scope.topCategories = [
					{ name: "Bier- & Biermischgetränke"},
					{ name: "Brot & Backwaren"},
					{ name: "Einrichtung"},
					{ name: "Fleisch"},
					{ name: "Getränke"},
					{ name: "Kaffee"},
					{ name: "Obst & Gemüse"},
					{ name: "Parfüm & Duft"},
					{ name: "Putzen & Reinigen"},
					{ name: "Restaurantgutscheine"},
					{ name: "Schönheit & Pflege"},
					{ name: "Spielwaren"},
					{ name: "Tiefkühlkost"},
					{ name: "Tierbedarf"},
					{ name: "Windeln & Wickeln"}
				];
				scope.topBrands = [
					{ name: "Barilla"},
					{ name: "Coca-Cola"},
					{ name: "Dr.Oetker"},
					{ name: "Gerolsteiner"},
					{ name: "Iglo"},
					{ name: "Krombacher"},
					{ name: "Lego"},
					{ name: "Lindt"},
					{ name: "Milka"},
					{ name: "Müller"},
					{ name: "Pampers"},
					{ name: "Persil"},
					{ name: "Philips"},
					{ name: "Playmobil"},
					{ name: "Samsung"}		
				];

				// scope.$watch("params", () => {

				// 	var params = {
				// 		limit: 10,
				// 		as: "mobile"
				// 	};

				// 	if(!scope.topCategories.results) {
				// 		api.categories.children(0, params).then(successCategories => {
				// 			scope.topCategories = successCategories ? successCategories : scope.topCategories;
				// 		});
				// 	}

				// 	if(!scope.topBrands.results) {
				// 		api.brands.query(params).then(successBrands => {
				// 			scope.topBrands = successBrands
				// 		});
				// 	}

				// });

				scope.$watch("class", (newVal: string) => {
					scope.menuClass = newVal
				});

				scope.toggleClass = (title: string) => {

					if(title === 'categories')
						scope.showCategories = !scope.showCategories;

					if(title === 'brands')
						scope.showBrands = !scope.showBrands;

				};

				scope.close = () => {
					scope.$emit("mg:close-menu");
				}
			}
		}
	})
}