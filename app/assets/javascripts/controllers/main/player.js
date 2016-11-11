/* global angular */

angular.module('mariposa-training')
  .controller('PlayerCtrl', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) { 
    $scope.lecture = {
      Soid: $stateParams['lectureSoid']
    };
  }]);
