/* global angular */

angular.module('mariposa-training')
  .controller('LandingPageCtrl', ['$scope', '$state', '$window', function($scope, $state, $window){
   
  $scope.goToCALTCM = function(){
    $window.open("https://www.caltcm.org/");
  };
  
  $scope.goToAdv4Equity = function(){
    
  };
  
  $scope.goToQCHF = function(){
    $window.open("https://www.cahf.org/Education-Events/QCHF");
  };
   
}]);