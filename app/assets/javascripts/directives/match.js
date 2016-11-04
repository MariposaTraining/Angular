/* global angular */

angular.module('mariposa-training').directive('match',function () {
    return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {
            ngModel.$parsers.unshift(validate);

            // Force-trigger the parsing pipeline.
            scope.$watch(attrs.match, function() {
                ngModel.$setViewValue(ngModel.$viewValue);
            });

            function validate(value) {
                var isValid = scope.$eval(attrs.match) == value;

                ngModel.$setValidity('match', isValid);

                return isValid ? value : undefined;
            }
        }
    };
}); 