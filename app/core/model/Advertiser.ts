module Marktguru {

	export class AdvertiserDto {
        id: string;
        type: string;
        data: Advertiser
    }

	export class Advertiser {
		id: number;
		name: string;
		shortName: string;
		industryId: number;
	}
}