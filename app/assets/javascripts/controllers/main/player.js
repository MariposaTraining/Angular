/* global angular */

angular.module('mariposa-training')
  .controller('PlayerCtrl', ['$scope', 'Lecture',
  function($scope, Lecture) {
    Lecture.find('5809f5edeabbde0df80e05a1')
      .then(function (lecture) {
        console.log(lecture);
        return lecture.getTest();
      })
      .then(function (test) {
        console.log(test);
      });
}]);
