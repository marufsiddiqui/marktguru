///<reference path="./Common.ts"/>

module Marktguru {

    export enum SearchResultType
    {
        noResults,
        advertisments,
        stores
    }

    export class SearchResult extends PagedList<any> {
        type: SearchResultType;
        data: { id: number};
    }
}