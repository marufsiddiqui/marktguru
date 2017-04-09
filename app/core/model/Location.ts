///<reference path="./Common.ts"/>

module Marktguru {
	export class Location {
		id: number;
		name: string;
		country: string;
		state: string;
		province: string;
		zipCodes: string[];
		latitude: number;
		longitude: number;
	}
}