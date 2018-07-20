/* global angular */

angular.module('mariposa-training').controller('RegisterCtrl', ['$scope', '$state', 'AuthService', 'Account', 'Cart',
    function ($scope, $state, AuthService, Account, Cart) {
  
    var clearData = function(){
        $scope.info = {
            firstName: '',
            lastName: '',
            emailAddress: '',
            password: '',
            facilitySoid: '',
            facility: ''
        };
        $scope.tmpAssoc = "";
        $scope.assocCheckbox = [];
        $scope.tmpRole = "";
        $scope.roleCheckbox = [];
        $scope.passwordConfirmation = '';
    };
    
    $scope.roles = AuthService.roles;
    $scope.associations = AuthService.associations;
  
    clearData();
    
    $scope.passwordConfirmation = null;
    $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
    
    var processName = function(name){
        return name.trim().toLowerCase().replace(/\w\S*/g, function(txt){
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
    };
    
    var extractActiveAssociations = function(){
        
        var assocs = [];
        
        for(var i=0; i<$scope.associations.length; i++){
            if($scope.assocCheckbox[i])
                assocs.push($scope.associations[i]);
        }
        
        if($scope.tmpAssoc.trim() != "")
            assocs.push($scope.tmpAssoc.trim());
            
        return assocs;
    };
    
    var extractActiveRoles = function(){
        var tmpRoles = [];
        
        for(var i=0; i<$scope.roles.length; i++){
            if($scope.roleCheckbox[i])
                tmpRoles.push($scope.roles[i]);
        }
        
        if($scope.tmpRole.trim() != "")
            tmpRoles.push($scope.tmpRole.trim());
            
        return tmpRoles;
    };
    
    var attemptRegistration = function(){
        
        var registrationData = {
            firstName: $scope.info.firstName,
            lastName: $scope.info.lastName,
            emailAddress: $scope.info.emailAddress,
            password: $scope.info.password,
            facilitySoid: $scope.info.facilitySoid,
            facility: $scope.info.facility,
            associations: extractActiveAssociations(),
            roles: extractActiveRoles()
        };
        
        AuthService.register(registrationData)
        .then(function success(data){
            if(data && data.data && data.data.ok){
                $scope.registerInvalid = false;
                
                clearData();
                
                Cart.getCart();
                
                $("#sign-dialog").modal('hide');
                $scope.disableBtn = false;
                if($state.current.name != 'cart')
                    Account.goToDefaultTab();
            }else{
                $scope.disableBtn = false;
                $scope.registerInvalid = true;
            }
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