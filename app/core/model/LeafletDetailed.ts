///<reference path="./Common.ts"/>

module Marktguru {
	export class Coordinates {
		fromX: number;
        fromY: number;
        toX: number;
        toY: number;
	}

	export class LeafletChild {
		id: string;
		coordinates: Coordinates;
		pageIndex: number;
	}

	export class LeafletDetailed {
		id: number;
		leafletFlightId: number;
		name: string;
		validFrom: Date;
		validTo: Date;
		externalTrackingUrls: string[];
		pageImages: ImageSetMetadata;
		children: LeafletChild[];
		imageUrl: string;

		advertiser: { name: string };
		industry: { name: string };
	}
}