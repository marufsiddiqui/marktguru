///<reference path="./Common.ts"/>

module Marktguru {
    export class OfferDetailed extends Advertisement {
        description: string;
        price: number;
        oldPrice: number;
        referencePrice: number;
        requiresLoyalityMembership: boolean;
        loyalityCostDescription: string;
        validityDates:{from:Date, to:Date}[];
        leafletFlightId: number;
        externalUrl: string;
        externalTrackingUrls: string[];
        industries: {id: number; name: string}[];
        product: {
            id: number;
            name: string;
            description: string;
        };
        unit: {
            id: number;
            name: string;
            shortName: string;
        };
        brand: {
            id: number;
            name: string;
            industryId: number;
        };
        categories: {
            id: number;
            name: string;
            description: string;
            parentId: number;
        }[];
        images: {
            count: number;
            metadata: ImageMetadata[];
        };
        imageType: string;
        imageUrl: string;
        type: string;
    }
}