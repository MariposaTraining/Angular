/* global angular */

angular.module('mariposa-training')
  .controller('CheckoutCtrl', ['$scope', '$state', 'Account', 'Cart', 'ITEM_TYPES', 'Session', 'Transaction', 'Logger',
    function($scope, $state, Account, Cart, ITEM_TYPES, Session, Transaction, Logger){
    
    $scope.purchase = function(){
      if($scope.Cart.getTotalPrice() > 0 && $scope.Transaction.hasValidToken())
        $scope.Transaction.purchase().then(purchaseSucces, purchaseError);  
      else if($scope.Cart.getTotalPrice() == 0){
        $scope.Transaction.purchaseForFree().then(purchaseSucces, purchaseError);
        Logger.logData("CheckoutCtrl: purchase: purchase for free", "");
      }
    };
    
    var purchaseSucces = function(response){
      if(response.data && response.data.ok == true){
        Logger.logData("CheckoutCtrl: purchase success", JSON.stringify(response));
        $scope.Cart.getCart();
        $scope.postpayment = true;
        $scope.paymentSuccessful = true;
        Account.loadMemberObject();
      }else{
        Logger.logData("CheckoutCtrl: purchase success: status 200 but not successful", JSON.stringify(response));
        $scope.errorMessage = response.data.message;
        $scope.postpayment = true;
        $scope.paymentSuccessful = false;
        $scope.Transaction.prepareTransaction = true;
        $scope.Transaction.setToken(null);
      }
    };
    
    var purchaseError = function(response){
      Logger.logData("CheckoutCtrl: purchase error", JSON.stringify(response));
      $scope.errorMessage = response.data.message;
      $scope.postpayment = true;
      $scope.paymentSuccessful = false;
      $scope.Transaction.prepareTransaction = true;
      $scope.Transaction.setToken(null);
    };
    
    $scope.removeCourse = function(c){
      $scope.Cart.removeItem(ITEM_TYPES.course, c);
    };
    
    $scope.removeCertification = function(c){
      $scope.Cart.removeItem(ITEM_TYPES.certification, c);
    };
    
    $scope.removeBundle = function(c){
      $scope.Cart.removeItem(ITEM_TYPES.bundle, c);
    };
    
    $scope.checkout = function(){
      if(Session.userId == null)
        Session.showLoginForm = true;
    };
    
    $scope.paymentInfo = function(){
      $scope.Transaction.prepareTransaction = true;
      $state.go('paymentInfo');
    };
    
    $scope.goToPaymentPage = function(){
      $state.go('paymentInfo');
    };
    
    $scope.reviewCart = function(){
      $scope.postpayment = false;
    };
    
    $scope.goToAccountNew = function(){
      $state.go("accountNew");
    };
    
    $scope.init = function(){
      $scope.Session.showLoginForm = false;
      $scope.Cart = Cart;
      $scope.Session = Session;
      $scope.Transaction = Transaction;
      
      $scope.postpayment = false;
  
      var d = new Date();
      $scope.date = (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear();
    };
    
    $scope.init(); 
    
}]);