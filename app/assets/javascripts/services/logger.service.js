/* global angular */

angular.module('mariposa-training').service('Logger', ['$http', 'Session',
    function($http, Session) {
        
        this.logData = function(path, log){
            if(log && path){
                var url = "/Log";
                var data = {data: "------ Logger Service ------ MemberSoid: " + Session.userId + "; path: " + path + "; log: " + log};
                return $http.post(url, data);  
            }else
                return null;
        };
        
        
        
    }
]);