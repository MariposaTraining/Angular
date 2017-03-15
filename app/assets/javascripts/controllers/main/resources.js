/* global angular */

angular.module('mariposa-training').controller('ResourcesCtrl', function ($scope) {

  $scope.whitepapers = [];
  
  function init(){
    $scope.whitepapers.push({
      title: "Fall Prevention: Top 10 Tips to Prevent Falls & Fall-Related Injuries",
      description: "Falls are a leading cause of injury and death in nursing home residents, learn how to take every step possible to prevent them.",
      link: "http://media.mariposatraining.com/working-fall-prevention-wp.html",
      btnText: "GET WHITE PAPER"
    });
  }
  
  init();

})