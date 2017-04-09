///<reference path="../../Application.ts"/>

module Marktguru {
    class AlertMessage {
        body: string;
        key: string;
    }
    export class AlertsController {

		items: AlertMessage[] = [];

		constructor($sce: ng.ISCEService, private localStorage: LocalStoreService) {            

			var bootMessages = [{
                body: $sce.trustAsHtml('Wir verbessern Marktguru Webseite ständig, dazu setzen wir unter anderem Cookies ein. Mit Ihrem Besuch stimmen Sie deren Nutzung zu. <a target="_blank" href="http://info.marktguru.de/datenschutz-agbs/">Mehr Informationen.</a>'),
                key: "mg-alerts-cookies"
            }];
            for(var message of bootMessages) {
                if(!localStorage.get<boolean>(message.key)) this.items.push(message);
            }

		}
        close(alert: AlertMessage) {
            var index = this.items.indexOf(alert);
            if(this.items[index].key) this.localStorage.set(this.items[index].key, true);
            if(index >= 0) this.items.splice(index, 1);
        }

	}
	app.controller("AlertsController", AlertsController)
}