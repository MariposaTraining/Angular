/* global angular */

angular.module('mariposa-training')
  .controller('CertificationsCtrl', ['$scope', '$state', 'Catalog', 'Cart', 'Session', 'Account', 'ITEM_TYPES', 
    function($scope, $state, Catalog, Cart, Session, Account, ITEM_TYPES){
   
    $scope.showCourses = [];
    $scope.Session = Session;
    $scope.Account = Account;
   
    if(Catalog.hasOwnProperty("data") && Catalog.data != null && Catalog.data.hasOwnProperty('Certifications') && Catalog.data.Certifications != null){
        $scope.certifications = Catalog.data.Certifications;
    }else
        Catalog.getCertifications().then(function(res){
            $scope.certifications = res;
        });
        
    $scope.learnMore = function(c){
        $state.go('classDescription', {Soid:c.Soid});
    };
    
    $scope.buy = function(c){
        Cart.addItem(ITEM_TYPES.certification, c);
    };
    
    $scope.watch = function(c){
        $scope.Account.play($scope.Account.getLectureSoid(c.Soid));
    };
    
    $scope.test = function(c){
        $scope.Account.test($scope.Account.getLectureSoid(c.Soid));
    };
    
    $scope.print = function(c){
        $scope.Account.print($scope.Account.getLectureSoid(c.Soid));  
    };
   
}]);