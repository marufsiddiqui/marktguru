///<reference path="../../Application.ts"/>

module Marktguru {

    export class MemoryCache {

        private cache = {};
        constructor(private $timeout: ng.ITimeoutService) { }

        put(key: string, value: any, time: number) {
            if (this.cache[key]) this.delete(key)
            var entry: any = {
                value: value,
                timeout: this.$timeout(() => { this.delete(key); }, time)
            }
            this.cache[key] = entry;
        }

        delete(key) {
            var entry = this.cache[key];
            if (entry) this.$timeout.cancel(entry.timeout);
            delete this.cache[key];
        }

        get(key) {
            var cached = this.cache[key];
            return cached ? cached.value : null;
        }
    }
    app.service("cache", MemoryCache);
}