/* global angular */

angular.module('mariposa-training').controller('LoginCtrl', ['$scope', 'AuthService', '$state', 'Account', 'Cart', 
  function ($scope, AuthService, $state, Account, Cart) {
  
  $scope.credentials = {
    username: '',
    password: ''
  };
  
  $scope.login = function (credentials) {
    
    $scope.disableBtn = true;
    
    AuthService.login(credentials).then(function (response) {
      
      if(response.data.ok == true){
        $scope.credentials = {
          username: '',
          password: ''
        };
        $scope.loginInvalid = false;
        $("#sign-dialog").modal('hide');
        $scope.disableBtn = false;
        Cart.getCart();
        if($state.current.name != 'cart')
          Account.goToDefaultTab();
      }else{
        $scope.disableBtn = false;
        $scope.loginInvalid = true;
        $scope.errorMessage = response.data.message;
      }
    
    }, function () {
      $scope.loginInvalid = true;
      $scope.disableBtn = false;
      // here should also be the code to extract message from the response 
    });
  };

  $scope.recoverPassword = function(){
    
    $("#sign-dialog").modal('hide');
    
    $state.go("passwordRecovery");
  }
    
}]);