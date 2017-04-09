///<reference path="../../Application.ts"/>

module Marktguru {
    
    /**
     * Agof tracking wrapper.
     * See docs for reference: https://www.infonline.de/download/infonline-integration-guide-szm-tag-2/?wpdmdl=3283
     */
    export class Agof {
        track(name: string, code: string) {
            var event = {
                "st": "markguru", // offer idetifier - must be 8 chars long
                "cp": code, // code
                "sv": "ke", // Es wird keine Befragungseinladung ausgeliefert.
                "co": name // comment 
            }
            if(typeof(iom) == "undefined") { console.error("Tracking is blocked."); return;}
            iom.c(event, 2/* use newImage for requests. if not set will use document.write :( */);
		}
	}

	app.service("agof", Agof);
}