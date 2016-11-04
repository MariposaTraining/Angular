/* global angular */

angular.module('mariposa-training').service('Invoice', ['$http', '$q', 'Session', 
    function($http, $q, Session) {
        
        var self = this;
        
        this.getInvoices = function(){
            if(Session.userId != null)
                return $http.post("/Api/GetInvoices", {memberSoid: Session.userId});
            else
                return null;
        };
        
        this.getInvoice = function(soid){
            if(soid != null)
                return $http.post("/Api/GetInvoice", {invoiceSoid: soid});
            else 
                return null;
        };
        
    }
]);