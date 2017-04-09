///<reference path="../../Application.ts"/>

module Marktguru {

    export class GeolocationUtils {
		
		private rad(x): number {
			return x * Math.PI / 180;
		}

		public getDistance(p1, p2): number {
			var R = 6378137; // Earth’s mean radius in meter
			var dLat = this.rad(p2.lat() - p1.lat());
			var dLong = this.rad(p2.lng() - p1.lng());
			var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			    Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat())) *
			    Math.sin(dLong / 2) * Math.sin(dLong / 2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			var d = R * c;
			return (d / 1000); // returns the distance in km
		}
		
	}
	
	app.service("geolocationUtils", GeolocationUtils);
}