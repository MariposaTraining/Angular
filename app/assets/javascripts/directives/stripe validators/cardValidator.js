/* global angular */

var app = angular.module('mariposa-training');
app.directive('cardValidator', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attr, ctrl) {
      ctrl.$parsers.unshift(function(value) {
        if(value){
          var valid = Stripe.card.validateCardNumber(value);
          ctrl.$setValidity('number', valid);
        }
        return value;
      });
    }
  };
});