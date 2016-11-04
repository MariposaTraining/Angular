/* global angular */

var app = angular.module('mariposa-training');
app.directive('expiryValidator', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attr, ctrl) {
      ctrl.$parsers.unshift(function(value) {
        var valid = scope.checkExpiryValidity();
        return value;
      });
    }
  };
});