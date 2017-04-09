module Marktguru {
	export class PagedList<T> {
        totalResults: number;
		skippedResults: number;
        results: T[];
    }

	export class ImageMetadata {
        aspectRatio: number;
        height: number;
     	width: number;
    }

	export class ImageSetMetadata{
		count: number;
		metadata: ImageMetadata[];
	}

	export class TimeInterval {
		from: string;
		to: string;
	}

    export class ContactData {
		telephone: string;
		fax: string;
		email: string;
	}

	export class OpeningHours {
		specification: string;
		displayText: string;
	}

	export class LayoutProgram {
		name: string;
		url: string;
	}

	export class WorkingHours {
		date: Date;
		intervals: TimeInterval[];
	}

	export class Advertisement {
		id: number;
		name: string;
		advertisers: {
			id: string;
			name: string;
			shortName: string;
			industryId: number;
		}[];
	}

	export class GenericRequestParams {
		offset: number;
		limit: number;
		workflowstate: string;
		advertiserid: number;
		industryid: number;
		filter: string;
		zipcode: string;
		q: string;
		as: string = "mobiledetailed";
	}
}