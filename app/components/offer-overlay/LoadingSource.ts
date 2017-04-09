 module Marktguru
 {

    app.directive("mgSrc", (/*$timeout: ng.ITimeoutService*/) => {
        return {
            restrict: "A",
            link: (_scope: ng.IScope, elm: ng.IAugmentedJQuery, attr) => {
                var element:any = elm[0];
                element.src = "assets/images/placeholder.bccd4244.png"
                element.style.opacity = 0;
                element.style.transition = "0.2s linear all";
                
                attr.$observe('mgSrc', function(val: string){ 
                    if(val){
                        let img = new Image();
                        img.src = val;                        
                    
                        img.onload = () => {                                                        
                            element.src = img.src;                                
                            element.style.opacity = 1;
                        };
                    }
                });
            }
                        
        }
    });

 }