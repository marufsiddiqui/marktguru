///<reference path="./Common.ts"/>

module Marktguru {
	export enum LinkType {
		external,
		internal
	}

	export class AdCollectionDetailed extends Advertisement {
		description: string;
		type: string;
		command: {
			type: string;
			leafletId: number;
			leafletFlightId: number;
			pageIndex: number;
			offerId: number;
			terms: string;
			linkType: LinkType;
			url: string;
		};
		validFrom: string;
		validTo: string;
		collectionId: string;
		pageIndex: number;
		externalTrackingUrl: string;
		images: {
            count: number;
            metadata: ImageMetadata[];
        };
		imageUrl: string;
		references: {
			pageIndex: number,
			leafletId: number
		}[];
	}
}