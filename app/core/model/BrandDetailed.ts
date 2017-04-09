///<reference path="./Common.ts"/>

module Marktguru {
	export class BrandDetailed {
		id: number;
		name: string;
		shortName: string;
		industryId: number;
		seoTexts: {};
		loyaltyProgram: LayoutProgram;
		indexContent: boolean;
		links: {};
		imageUrl: string;
	}
}