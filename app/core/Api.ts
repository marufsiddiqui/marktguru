///<reference path="../Application.ts"/>
///<reference path="model/Common.ts"/>
///<reference path="model/OfferDetailed.ts"/>
///<reference path="model/RetailerMobile.ts"/>
///<reference path="model/ProductMobile.ts"/>
///<reference path="model/BrandDetailed.ts"/>
///<reference path="model/Store.ts"/>
///<reference path="model/LeafletDetailed.ts"/>
///<reference path="model/AdCollectionDetailed.ts"/>
///<reference path="model/LeafletDetailed.ts"/>
///<reference path="model/Location.ts"/>
///<reference path="model/IndustryDetailed.ts"/>
///<reference path="services/BatchHttp.ts"/>
///<reference path="model/Category.ts"/>
///<reference path="model/Search.ts"/>
///<reference path="model/Advertiser.ts"/>
///<reference path="model/LeafletFlight.ts"/>

module Marktguru {

    export class ImageApi {
        constructor(private url: string) { }

        xsmall = (index: number) => this.get(index, "xsmall");

        small(index: number): string {
            return this.get(index, "small");
        }

        medium(index: number): string {
            return this.get(index, "medium");
        }

        large(index: number): string {
            return this.get(index, "large");
        }

        xlarge(index: number): string {
            return this.get(index, "xlarge");
        }

        private get(index: number, profile: string) {
            return `${this.url}/${index}/${profile}.jpeg`
        }
    }

    export class Api<T> {
        protected url: string;        

        constructor(
            private name: string,
            protected $http: BatchHttp,
            protected apiConfig: ApiConfiguration,
            protected config: Configuration) {
            this.url = this.buildUrl(apiConfig.protocol, apiConfig.apiHostAddress, name);            
        }

        images(id: number, type: string) {            
            return new ImageApi(`${this.buildUrl(this.apiConfig.protocol, this.config.mediaHostAddress, this.name)}/${id}/images/${type}`);
        }

        private buildUrl(protocol: string, host: string, resource: string) {
            return `${protocol}://${host}/api/v1/${resource}`;
        }

        protected getList(url: string, params?: {}, cancellation?: ng.IPromise<any>) {
            return this.$http.get<PagedList<T>>(url, {
                params: params,
                headers: { "Accept-Language": this.config.defaultLanguage },
                timeout: cancellation
            }).then(res => res.data);
        }

        query(params?: {}, cancellation?: ng.IPromise<any>): ng.IPromise<PagedList<T>> {
            return this.getList(this.url, params, cancellation);
        }

        get(id: any, detailed?: boolean): ng.IPromise<T> {
            return this.$http.get<T>(`${this.url}/${id}`, {
                params: { "as": detailed == true ? "mobiledetailed" : "mobile" }
            }).then(res => res.data);
        }

        getMany(ids: number[], cancellation?: ng.IPromise<any>): ng.IPromise<PagedList<T>> {
            return this.getList(this.url + "/batch", {ids: ids, as: "mobiledetailed"}, cancellation);
        }
    }

    export class LocationsApi extends Api<Location> {
        current() {
            return this.getList(this.url + "/current", {});
        }
    }

    class AdvertisementsApi<T> extends Api<T> {
        stores(id: number, location: Location, limit = 6) {
            var params:any = {
                as: "mobile",
                limit: limit
            };
            if (location) {
                params.longitude = location.longitude;
                params.latitude = location.latitude;
            }
            return this.$http.get<PagedList<Store>>(`${this.url}/${id}/stores`, {
                params: params
            }).then(res => res.data);
        }
    }
    export class LeafletsApi extends AdvertisementsApi<LeafletDetailed> {}
    export class OffersApi extends AdvertisementsApi<OfferDetailed> {}

    export class CategoriesApi extends Api<Category> {
        children(id: number, params? : {}) {
            return this.getList(`${this.url}/${id}/children`, params);
        }
    }

    export class SearchApi extends Api<SearchResult> {
        suggestions(params?: {}, cancellation?: ng.IPromise<any>): ng.IPromise<string[]> {
            return <any>this.getList(`${this.url}/suggestions`, params, cancellation);
        }
    }

    export class Event {

    }

    export class EventsApi extends Api<any> {
        track(type: string, event: {}): ng.IPromise<any> {
            return this.$http.post(`${this.url}/${type}`, event);
        }
    }

    export class StoresApi extends Api<Store> {
        getOpenIntervals(id: number, dates: Date[]) {
            return this.$http.get<WorkingHours[]>(`${this.url}/${id}/openintervals`, {
                params: { dates: dates.map(d => d.toISOString().split("T")[0]) }
            }).then(res => res.data);
        }
    }

    export class LeafletFlightApi extends Api<LeafletFlight> {
        bestleaflet(id: number, params:{}){
            return this.$http.get<LeafletDetailed>(`${this.url}/${id}/bestleaflet`, { params: params}).then(res => res.data);
        }
    }

    export class ApiFactory {
        constructor(
            private batchHttp: BatchHttp,
            private apiConfig: ApiConfiguration,
            private config: Configuration) { }

        private resource<T>(name: string) {
            return new Api<T>(name, this.batchHttp, this.apiConfig, this.config);
        }

        offers = new OffersApi("offers", this.batchHttp, this.apiConfig, this.config);
        retailers = this.resource<RetailerMobile>("retailers");
        products = this.resource<ProductMobile>("products");
        brands = this.resource<BrandDetailed>("brands");
        stores = new StoresApi("stores", this.batchHttp, this.apiConfig, this.config);
        storechains = this.resource<Store>("storechains");
        advertisementcollections = this.resource<AdCollectionDetailed>("advertisementcollections");
        leaflets = new LeafletsApi("leaflets", this.batchHttp, this.apiConfig, this.config);
        industries = this.resource<IndustryDetailed>("industries");
        locations = new LocationsApi("locations", this.batchHttp, this.apiConfig, this.config);
        categories = new CategoriesApi("categories", this.batchHttp, this.apiConfig, this.config);
        advertisments = new SearchApi("search", this.batchHttp, this.apiConfig, this.config);
        events = new EventsApi("events", this.batchHttp, this.apiConfig, this.config);
        advertisers = this.resource<AdvertiserDto>("advertisers");
        leafletFlights = new LeafletFlightApi("leafletflights", this.batchHttp, this.apiConfig, this.config);
    }
    app.service("api", ApiFactory);
}