/* global angular moment $document */

angular.module('mariposa-training').controller('HomeCtrl', ['$scope', '$document', '$http', '$sce', '$state', '$timeout', '$window', 'AuthService', 'Catalog', 
  function($scope, $document, $http, $sce, $state, $timeout, $window, AuthService, Catalog) {
  
  String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.split(search).join(replacement);
  };

  
  $scope.goLocal = function(state, parameter){
    if(parameter)
      $state.go(state, {Soid: parameter});
    else
      $state.go(state);
  };
  
  $scope.goGlobal = function(url){
    $window.location.href = url;
  };
  
  $scope.learnMore = function(featuredClass){
    $state.go('classDescription', {Soid:featuredClass.soid});
  };
  
  var fillFeaturedClasses = function(){
    $scope.featuredClasses = [];
    
    $scope.featuredSoids = ["5172bb84dbbf5813546c60ec"];
    
    for(var i = 0; i < $scope.featuredSoids.length; i++){
        Catalog.getCourseById($scope.featuredSoids[i]).then(function(result){
            $scope.featuredClasses.push({
              soid: result.Soid,
              name: result.Name,
              description: result.Subject,
              thumbSrc: result.thumbSrc
            });
        });
    }
    
  };
  
  $scope.init = function(){
    
    $scope.classesWithCEUs = [
      {filterObject: {Soid: "5172bb12dbbf5813546c4b4a", ApprovalBody: "CE Broker - Florida Board of Nursing"}, text: "Nursing Home Administrators (NAB)"},  
      {filterObject: {Soid: "", ApprovalBody: ""}, text: "Assisted Living Administrators"},  
      {filterObject: {Soid: "5172bb12dbbf5813546c4b42", ApprovalBody: "Board of Registered Nursing"}, text: "Registered Nurses"},  
      {filterObject: {Soid: "5172bb12dbbf5813546c4b42", ApprovalBody: "Board of Registered Nursing"}, text: "Nurse Practitioners"},  
      {filterObject: {Soid: "5172bb12dbbf5813546c4b44", ApprovalBody: "CE Broker - Florida Board of Nursing"}, text: "Nursing Assistants"},  
      {filterObject: {Soid: "", ApprovalBody: ""}, text: "Mental Health Practitioners"},  
      {filterObject: {Soid: "", ApprovalBody: ""}, text: "Marriage and Family Therapy Practitioners"},  
      {filterObject: {Soid: "55028a119ed18719081ae92a", ApprovalBody: "National Association of Social Work - Hawaii"}, text: "Social Workers"},  
      {filterObject: {Soid: "53971ee4b8666e1760766d2a", ApprovalBody: "National Association of Activity Professionals"}, text: "Activity Professionals"},  
      {filterObject: {Soid: "", ApprovalBody: ""}, text: "Occupational Therapy"}
    ];
    
    $scope.waitingForEventbrite = true;
    
    fillFeaturedClasses();
  
    $http({method: 'GET', url: "/Eventbrite"}).then(function(result){
      $scope.waitingForEventbrite = false;
      
      $scope.ebEvents = result.data.events.filter(function(el){
        return el.status == "live";
      });
      
      $scope.ebEvents = result.data.events.map(function(el){
        el.description.html = el.description.html.replace(/\s+/g, ' ');
        el.description.html = $sce.trustAsHtml(el.description.html);
        el.start.displayedDate = moment(el.start.utc).format("MMMM Do, h:mm a");
        return el;
      });
      
    }, function(result){
      console.log(result);
      $scope.waitingForEventbrite = false;
    });
      
  };
  
  $scope.init();
  
}]);