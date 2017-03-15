/* global angular */

angular.module("mariposa-training")
    .directive("subscription", ['$timeout', 'Management', 'AuthService', 
    function($timeout, Management, AuthService){
        
        function link(scope, element, attrs){
            
              scope.clearNewsletterSubscriber = function(){
                scope.newsletterSubscriber = {
                  firstName: null,
                  lastName: null,
                  emailAddress: null
                };
              };
              
              var fillSubscriptionMessage = function(ok, text){
                scope.subscriptionMessage = {
                  ok: ok,
                  text: text
                };
                
                $timeout(function(){
                  scope.subscriptionMessage = null;
                }, 5000);
              };
              
              scope.subscribeForNewsletter = function(){
                AuthService.setNewsletter(scope.newsletterSubscriber).then(function(response){
                  scope.clearNewsletterSubscriber();
                  fillSubscriptionMessage(response.data.ok, "You have been added to the list and will receive our newsletter.");
                }, function(response){
                  fillSubscriptionMessage(response.data.ok, "The email address has already been registered.");
                });
              };
            
        }
        
        return{
            restrict: 'A',
            templateUrl: "directive/auth/subscription.html",
            link: link
        };
    }]);
