/* global angular */

angular.module('mariposa-training').controller('InvoicesCtrl', ['$scope', 'Invoice', function ($scope, Invoice) {
  
    $scope.invoices = [];
  
    Invoice.getInvoices().then(function success(response){
        
        for(var i = 0; i < response.data.data.length; i++)
            Invoice.getInvoice(response.data.data[i].Soid).then(
                function success(response){
                    console.log(response);
                    var v = response.data.data.InvoicedOn.substr(6, 13);
                    response.data.data.InvoicedOn = new Date(Number(v));
                    response.data.data.CardNumber = response.data.data.Payments[0].Card.Name.substr(response.data.data.Payments[0].Card.Name.lastIndexOf("last4")+9, 4);
                    for(var i = 0; i < response.data.data.Payments.length; i++){
                        v = response.data.data.Payments[i].PaidOn.substr(6, 13);
                        response.data.data.Payments[i].PaidOn = new Date(Number(v));
                    }
                    $scope.invoices.push(response.data.data); 
                    $scope.invoices.sort(function(a,b){
                      return a.InvoicedOn - b.InvoicedOn;
                    });
                }, function error(response){
                    console.log(response);
                });
        
    }, function error(response){
        console.log(response);
    });
    
    $scope.setDetailedInvoice = function(inv){
        $scope.detailedInvoice = inv;  
    };
    
}]);