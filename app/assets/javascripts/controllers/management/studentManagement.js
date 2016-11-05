/* global angular */

angular.module('mariposa-training').controller('StudentManagementCtrl', ['$scope', '$state', '$timeout', 'AuthService', 'Session', 'Management', 'PersonalInfo',
    function ($scope, $state, $timeout, AuthService, Session, Management, PersonalInfo) {
    
    $scope.updatePage = function(i){
        var tmp = $scope.currentPage + i;
        if(tmp != 0 && tmp <= $scope.pagesNumber){
            $scope.currentPage = tmp;
            var start = $scope.numPerPage * $scope.currentPage - 1;
            $scope.displayedFacilities = $scope.Management.facilities.slice(start, start + $scope.numPerPage);
        }
    };
    
    var extractDisplayedFacilities = function(){
        $scope.displayedFacilities = $scope.Management.facilities.slice(0, $scope.numPerPage);
        $scope.pagesNumber = Math.ceil($scope.Management.facilities.length / $scope.numPerPage);
        $scope.currentPage = 1;
        if($scope.Management.facilities.length < 20) $scope.numsPerPage.pop();
    };
    
    $scope.init = function(){
        $scope.numPerPage = 10;
        $scope.Management = Management;
        $scope.currentPage = 1;
        
        $scope.numsPerPage = [10, 20, 30];
        
        if(!$scope.Management.facilitiesLoaded)
            $scope.Management.getCompleteFacilities().then(function(){
                extractDisplayedFacilities();
            });
        else{
            extractDisplayedFacilities();
        }
        
        $scope.$watch('numPerPage', extractDisplayedFacilities, true);
            
        $scope.Management.getManagerCourses();
    };
    
    $scope.init();
    
}]);