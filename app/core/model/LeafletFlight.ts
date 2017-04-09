///<reference path="./Common.ts"/>

module Marktguru {
	export class LeafletFlight {
		id: number;
		validFrom: Date;
		validTo: Date;
        mainLeafletId: number;
        mainLeafletPageIndex: number;
		advertiser: { name: string };
	}
}