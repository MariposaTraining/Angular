/* global angular */

angular.module('mariposa-training')
  .controller('BundlesCtrl', ['$scope', '$state', 'Catalog', 'Cart', 'Session', 'ITEM_TYPES', 
  function($scope, $state, Catalog, Cart, Session, ITEM_TYPES){
   
   $scope.showCourses = [];
   $scope.Session = Session;
   
   if(Catalog.hasOwnProperty("data") && Catalog.data != null && Catalog.data.hasOwnProperty('Bundles') && Catalog.data.Bundles != null){
        $scope.bundles = Catalog.data.Bundles;
    }else
        Catalog.getBundles().then(function(res){
            $scope.bundles = res;
        });
   
    $scope.learnMore = function(c){
        $state.go('classDescription', {Soid:c.Soid});
    }
    
    $scope.buy = function(b){
        Cart.addItem(ITEM_TYPES.bundle, b);
        console.log(Cart.getTotalPrice());
    }
   
}]);