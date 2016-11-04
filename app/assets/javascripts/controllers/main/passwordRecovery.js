/* global angular */

angular.module('mariposa-training')
  .controller('PasswordRecoveryCtrl', ['$scope', 'AuthService', function($scope, AuthService){
      
    $scope.emailAddress = "";
      
    $scope.requestPassword = function(){
        AuthService.passwordRecovery($scope.emailAddress)
        .then(function success(response){
            $scope.success = true;
            $scope.error = false;
            $scope.emailAddress = "";
        }, function error(response){
            $scope.error = true;
            $scope.success = false;
        });
    }
    
}]);