/* global angular */

angular.module('mariposa-training').service('Transaction', ['$http', 'Session',
    function($http, Session) {
        
        this.prepareTransaction = false;
        
        var self = this;
        
        this.setToken = function(token){
            self.token = token;
        };
        
        this.hasValidToken = function(){
            return self.token != null && self.token.id != null;
        };
        
        this.purchase = function(){
            
            if(self.hasValidToken()){
            
                var url = "/Api/SetPurchase";
                var data = {
                    memberSoid: Session.userId,
                    stripeToken: self.token.id,
                    cardInfo: self.token
                };
                
                return $http.post(url, data);  
            }else
                return null;
        };
        
        this.purchaseForFree = function(){
            var url = "/Api/SetPurchase";
            var data = {
                memberSoid: Session.userId,
                stripeToken: null,
                cardInfo: null
            };
            
            return $http.post(url, data); 
        };
        
        this.destroy = function(){
            this.token = null;
        };
        
    }
]);