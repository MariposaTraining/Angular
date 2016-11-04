/* global angular */

angular.module('mariposa-training').controller('RegisterCtrl', ['$scope', '$state', 'AuthService', 'Cart',
    function ($scope, $state, AuthService, Cart) {
  
    $scope.info = {
        firstName: null,
        lastName: null,
        emailAddress: null,
        password: null,
        facilitySoid: ''
    };
    
    $scope.passwordConfirmation = null;
    
    var processName = function(name){
        return name.trim().toLowerCase().replace(/\w\S*/g, function(txt){
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
    };
    
    var attemptRegistration = function(){
        AuthService.register($scope.info)
        .then(function success(data){
            $scope.registerInvalid = false;
            $scope.info = {
                firstName: '',
                lastName: '',
                emailAddress: '',
                password: '',
                facilitySoid: ''
            };
            $scope.passwordConfirmation = '';
            
            Cart.getCart();
            
            $("#sign-dialog").modal('hide');
            $scope.disableBtn = false;
            if($state.current.name != 'cart')
                $state.go("accountNew");
        },
        function error(data){
            $scope.disableBtn = false;
            $scope.registerInvalid = true;
        });
    };
    
    $scope.checkEmail = function(frm){
        if($scope.info.emailAddress != null && $scope.info.emailAddress != "")
            AuthService.checkEmailAddress($scope.info.emailAddress).then(function success(response){
                if(response.data.hasOwnProperty("ok") && response.data.ok == false){
                    $scope.errorMessage = response.data.message;
                    $scope.showErrorMessage = true;
                    frm.emailAddress.$setValidity("emailAvailable", false);
                }else{
                    $scope.errorMessage = null;
                    $scope.showErrorMessage = false;
                    frm.emailAddress.$setValidity("emailAvailable", true);
                } 
            });
    };
    
    $scope.register = function(){
        
        $scope.showErrorMessage = false;
        $scope.disableBtn = true;
        
        $scope.info.firstName = processName($scope.info.firstName);
        $scope.info.lastName = processName($scope.info.lastName);
        $scope.info.emailAddress = $scope.info.emailAddress.toLowerCase().trim();
        
        AuthService.checkEmailAddress($scope.info.emailAddress)
        .then(function success(response){
            if(response.data.hasOwnProperty("ok") && response.data.ok == false){
                $scope.errorMessage = response.data.message;
                $scope.showErrorMessage = true;
                $scope.disableBtn = false;
            }else{
                attemptRegistration();
            }
            
        }, function error(data){
            $scope.disableBtn = false;
            $scope.errorMessage = "An error ocurred. Please check the credentials or try later.";
        });
    };
    
    $scope.$watch('info', function () { $scope.showErrorMessage = false; }, true);
    
}]);