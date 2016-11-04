/* global angular */

var app = angular.module('mariposa-training');
app.directive('cvcValidator', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attr, ctrl) {
      ctrl.$parsers.unshift(function(value) {
        
        if(value){
          var valid = Stripe.card.validateCVC(value);
          ctrl.$setValidity('code', valid);
        }
        return valid ? value : undefined;
      });
    }
  };
});