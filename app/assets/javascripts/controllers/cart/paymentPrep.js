/* global angular */
/* global Stripe */

angular.module('mariposa-training')
  .controller('PaymentPrepCtrl', ['$scope', '$state', 'Transaction', 'Session', 'Logger', 'US_STATES', 
    function($scope, $state, Transaction, Session, Logger, US_STATES){
    
    $scope.preventSubmit = function(){
        $scope.disableBtn = true;
        try{
            if($scope.checkValidity())
                Stripe.card.createToken(document.getElementById("prepForm"), responseHandler);
        }catch(e){
            console.log(e);
        }
        return false;
    };
    
    $scope.checkCardType = function(){
        
        if($scope.card.cardValidation != null && $scope.card.cardValidation.toString() != ""){
            if($scope.card.cardValidation.toString()[0] == 3 
                    && ($scope.card.cardValidation.toString()[1] == 4 || $scope.card.cardValidation.toString()[1] == 7))
                $scope.maxLength = 15;
            else
                $scope.maxLength = 16;
        }else
            $scope.maxLength = 16;
    };
    
    $scope.checkCardValidity = function(){
        $scope.cardInvalid = !Stripe.card.validateCardNumber($scope.card.cardValidation);
    
        $scope.checkCardType();
            
        if(!$scope.cardInvalid)
            $scope.cardFound = Stripe.card.cardType($scope.card.cardValidation);
        else
            $scope.cardFound = null;
            
        return !$scope.cardInvalid;
    };
    
    $scope.checkCVCValidity = function(){
        $scope.cvcInvalid = !Stripe.card.validateCVC($scope.cvcValidation);
        return !$scope.cvcInvalid;
    };
    
    $scope.checkExpiryValidity = function(){
        $scope.expiryInvalid = !Stripe.card.validateExpiry($scope.expMValidation, $scope.expYValidation);

        if($scope.expiryInvalid && document.querySelector("#expDiv").className.indexOf("has-error") == -1)
            document.querySelector("#expDiv").className += " has-error";
        else if(!$scope.expiryInvalid)
            document.querySelector("#expDiv").className.replace(" has-error", "");
            
        return !$scope.expiryInvalid;
    };
    
    $scope.checkValidity = function(){
        return $scope.checkCardValidity() && $scope.checkCVCValidity() && $scope.checkExpiryValidity();
    };
    
    var responseHandler = function(status, response){
        Logger.logData("PaymentPrepCtrl: stripe response handler", "Status: " + status + JSON.stringify(response));
        $scope.disableBtn = false;
        if(response.error){
            $scope.errorMsg = response.error.message;
            $scope.$apply();
        }else{
            $scope.errorMsg = null;
            $scope.Transaction.setToken(response);
            $scope.Transaction.prepareTransaction = false;
            $state.go('cart');
        }
    };
    
    $scope.prepareData = function(){
      
        $scope.US_STATES = US_STATES.vals;
      
        $scope.errorMsg = null;
        $scope.cardInvalid = true;
        $scope.cvcInvalid = true;
        $scope.expiryInvalid = true;
        $scope.expMValidation = null;
        $scope.expYValidation = null;
        $scope.Transaction = Transaction;
        
        $scope.months = [
          {Id: 1, Name: 'January'},
          {Id: 2, Name: 'February'},
          {Id: 3, Name: 'March'},
          {Id: 4, Name: 'April'},
          {Id: 5, Name: 'May'},
          {Id: 6, Name: 'June'},
          {Id: 7, Name: 'July'},
          {Id: 8, Name: 'August'},
          {Id: 9, Name: 'September'},
          {Id: 10, Name: 'October'},
          {Id: 11, Name: 'November'},
          {Id: 12, Name: 'December'}
        ];
      
        $scope.years = [];
        for(var i = 2016; i < 2029; i++)
            $scope.years.push(i);
        
        $scope.maxLength = 16;
        
        $scope.card = {
            cardValidation: null
        };
    };
    
    $scope.prepareData();
    
}]);