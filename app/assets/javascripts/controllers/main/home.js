/* global angular */

angular.module('mariposa-training').controller('HomeCtrl', ['$scope', '$http', '$sce', '$state', '$timeout', '$window', 'AuthService', function($scope, $http, $sce, $state, $timeout, $window, AuthService) {
  
  String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.split(search).join(replacement);
  };
  
  $scope.deliberatelyTrustDangerousSnippet = function() {
    return $sce.trustAsHtml($scope.eventbriteEvents);
  };
  
  $scope.clearNewsletterSubscriber = function(){
    $scope.newsletterSubscriber = {
      firstName: null,
      lastName: null,
      emailAddress: null
    };
  };
  
  var fillSubscriptionMessage = function(ok, text){
    $scope.subscriptionMessage = {
      ok: ok,
      text: text
    };
    
    $timeout(function(){
      $scope.subscriptionMessage = null;
    }, 5000);
  };
  
  $scope.subscribeForNewsletter = function(){
    AuthService.setNewsletter($scope.newsletterSubscriber).then(function(response){
      $scope.clearNewsletterSubscriber();
      fillSubscriptionMessage(response.data.ok, "You have been added to the list and will receive our newsletter.");
    }, function(response){
      fillSubscriptionMessage(response.data.ok, "The email address has already been registered.");
    });
  };
  
  $scope.goLocal = function(state, parameter){
    if(parameter)
      $state.go(state, {Soid: parameter});
    else
      $state.go(state);
  };
  
  $scope.goGlobal = function(url){
    $window.location.href = url;
  }
  
  $scope.init = function(){
    $scope.waitingForEventbrite = true;
  
    $http({ method: 'GET', url: '/Eventbrite', headers: { 'Content-Type': 'text/plain' } })
      .then(function(result){
          $scope.eventbriteEvents = result.data;
          $scope.eventbriteEvents = $scope.eventbriteEvents
                                          .replaceAll('<div class="Toggle Collapsed" ></div>', '<div class="Toggle Collapsed pointer-cursor"><i class="material-icons rotate">play_arrow</i></div>')
                                          .replaceAll("Register...", "Register");
          $scope.waitingForEventbrite = false;
      });
      
    $scope.clearNewsletterSubscriber();
  };
  
  $scope.init();
  
}]);