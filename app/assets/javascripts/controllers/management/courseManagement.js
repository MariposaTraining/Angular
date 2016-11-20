/* global angular */

angular.module('mariposa-training').controller('CourseManagementCtrl', ['$scope', '$timeout', '$q', 'Session', 'Management', 'Account',
    function ($scope, $timeout, $q, Session, Management, Account) {
    
    $scope.setCourse = function(c){
        $scope.courseToSchedule = c;  
        $scope.dateToSchedule = null;
    };
    
    $scope.scheduleCourse = function(){
        
        var promises = [];
        var date = new Date($scope.dateToSchedule);
        $scope.reloadMember = false;
    
        $scope.showScheduling = true;
        
        for(var i = 0; i < $scope.Management.facilities.length; i++)
            for(var j = 0; j < $scope.Management.facilities[i].Students.length; j++)
                if($scope.Management.facilities[i].Students[j].hasOwnProperty("toSchedule") && $scope.Management.facilities[i].Students[j].toSchedule[$scope.courseToSchedule.Soid]){
                    promises.push($scope.Management.scheduleCourseForMember($scope.Management.facilities[i].Students[j].Soid, $scope.courseToSchedule.Soid, date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear()));
                
                    $scope.reloadMember = $scope.reloadMember || $scope.Management.facilities[i].Students[j].Soid == Session.userId;
                }
        $q.all(promises).then(function(){
            $scope.showScheduling = false;
            $scope.scheduled = $scope.courseToSchedule.Soid;
            $scope.courseToSchedule = null;
            $scope.dateToSchedule = null;
            
            if($scope.reloadMember){
                $scope.Account.reloadMemberObject();
                $scope.reloadMember = false;
            }
            $scope.Management.managerCoursesAttemptedLoad = false;
            $timeout(function () {
                $scope.dateToSchedule = null;
                $scope.scheduled = null;
            }, 2000);
            $("#scheduleStudent").modal("hide");
        });
    };
    
    $scope.init = function(){
        $scope.courseToSchedule = null;
        $scope.dateToSchedule = null;
        $scope.date = new Date();
        $scope.Management = Management;
        $scope.Management.getCompleteFacilities();
        $scope.Management.getManagerCourses();
        $scope.Account = Account;
    };
    
    $scope.init();
    
}]);