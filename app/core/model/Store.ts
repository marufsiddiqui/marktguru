///<reference path="./Common.ts"/>

module Marktguru {

	export class Address {
		id: string;
		latitude: number;
		longitude: number;
		address: string;
		name: string;
		zipCodes: string[];
	}

	class ExternalLink{
		displayText: string;
		url: string;
	}

	export class Store {
		isOpen: boolean;
		openIntervals: TimeInterval[];
		id: number;
		name: string;
		description: string;
		storeChainId: number;
		mallId: number;
		location: Address;
		contactData: ContactData;
		openingHours: OpeningHours;
		links: {
			facebook: ExternalLink;
		}
	}
}