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
    
    $scope.$watch('Management.facilityReloaded', function(){
        if($scope.Management.facilityReloaded)
            extractDisplayedFacilities();
        $scope.Management.facilityReloaded = false;
    }, true);
    
    var extractDisplayedFacilities = function(){
        if($scope.Management.facilities && $scope.Management.facilities.length > 0){
            $scope.displayedFacilities = $scope.Management.facilities.slice(0, $scope.numPerPage);
            $scope.pagesNumber = Math.ceil($scope.Management.facilities.length / $scope.numPerPage);
            $scope.currentPage = 1;
            
            resetActiveStudents();
            resetDroppedStudents();
                
            if($scope.Management.facilities.length < 20) {
                if($scope.numsPerPage && $scope.numsPerPage > 0) $scope.numsPerPage.pop();
                $scope.numPerPage = $scope.displayedFacilities ? $scope.displayedFacilities.length : 1;
            }
        }
    };
    
    var resetActiveStudents = function(){
        var i = 0;
        $scope.showActiveStudents = [];
        
        for(; i < $scope.displayedFacilities.length; i++)
            $scope.showActiveStudents.push(false);
    };
    
    var resetDroppedStudents = function(){
        var i = 0;
        $scope.showDropped = [];
        
        for(; i < $scope.displayedFacilities.length; i++)
            $scope.showDropped.push(false);
    };
    
    $scope.recover = function(memberSoid, facilitySoid){
        $scope.Management.recover(memberSoid, facilitySoid).success(function(response){
            $scope.Management.reloadFacility(facilitySoid);
        });
    };
    
    $scope.adaptActiveStudents = function(index){
        if(index >= 0 && index < $scope.displayedFacilities.length){
            if($scope.showActiveStudents[index])
                $scope.showActiveStudents[index] = false;
            else{
                resetActiveStudents();
                $scope.showActiveStudents[index] = true;
            }
        }  
    };
    
    $scope.adaptDroppedStudents = function(index){
        if(index >= 0 && index < $scope.displayedFacilities.length){
            if($scope.showDropped[index])
                $scope.showDropped[index] = false;
            else{
                resetDroppedStudents();
                $scope.showDropped[index] = true;
            }
        } 
    };
    
    $scope.init = function(){
        $scope.numPerPage = 10;
        $scope.Management = Management;
        $scope.currentPage = 1;
        
        $scope.numsPerPage = [10, 20, 30];
        
        if(!$scope.Management.facilitiesLoaded)
            $scope.Management.getCompleteFacilities().then(function(){
                extractDisplayedFacilities();
                $scope.Management.getManagerCourses();
            });
        else{
            extractDisplayedFacilities();
            $scope.Management.getManagerCourses();
        }
        
        $scope.$watch('numPerPage', extractDisplayedFacilities, true);

    };
    
    $scope.init();
    
}]);