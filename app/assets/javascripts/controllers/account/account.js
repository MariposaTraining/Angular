/* global angular */

angular.module('mariposa-training').controller('AccountCtrl', ['$scope', '$state', '$q', '$window', 'Account', 'Session', 'PersonalInfo', 'US_STATES', 'TIME_ZONES',
    function ($scope, $state, $q, $window, Account, Session, PersonalInfo, US_STATES, TIME_ZONES) {
  
    $scope.init = function(){
        
        $scope.US_STATES = US_STATES;
        $scope.Session = Session;
        $scope.TIME_ZONES = TIME_ZONES;
        $scope.Account = Account;
        
        PersonalInfo.getStudentTypes().then(function(res){
            if(res.data.ok == true)
                $scope.studentTypes = res.data.data;
        });
        
        if($state.current.name == 'accountNew' && $scope.Session.needsInfo){
            
            $scope.timeZone = $scope.Session.member.TimeZone;
            $scope.studentType = $scope.Session.member.StudentTypeSoid;
            $scope.licenseState = $scope.Session.member.LicenseState;
            $scope.licenseRenewalDate = $scope.Session.member.LicenseRenewalDate;
            
            $("#studentInfo").modal('show');
            $scope.Session.setNeedsInfo(false);
            
        }else if($state.current.name == 'accountNew' && $scope.Session.needsState){
            
            $scope.state = $scope.Session.member.LicenseState;
            
            $("#stateInfo").modal('show');
            $scope.Session.setNeedsState(false);
        }
        
        $scope.Account.sortCourses();
        
        angular.element($window).bind('focus', function() {
            if(Account.reloadNeeded)
                Account.reloadMemberObject();
        });
        
    };
    
    $scope.init();
    
    $scope.saveState = function(){
        PersonalInfo.setStudentState($scope.Session.userId, $scope.state).then(function(response){
            PersonalInfo.loadMemberObject(false);
        });
        $("#stateInfo").modal('hide');
    };
    
    $scope.submitAdditionalInfo = function(){
        
        var studentInfo = {
            memberSoid: $scope.Session.userId,
            studentTypeSoid: $scope.studentType ? $scope.studentType.Soid : null,
            profession: null,
            licenseState: $scope.licenseState,
            licenseRenewalDate: $scope.licenseRenewalDate,
            timeZone: $scope.timeZone,
            facilityCode: $scope.facilityCode
        };
        
        PersonalInfo.setStudentInfo(studentInfo).then(function(){
            PersonalInfo.loadMemberObject(true);
        });
        $("#studentInfo").modal('hide');
    };
    
    $scope.closeModal = function(){
        
        $scope.timeZone = null;
        $scope.licenseRenewalDate = null;
        $scope.licenseState = null;
        $scope.studentType = null;
        $scope.state = null;
        
        $("#stateInfo").modal('hide');
        $("#studentInfo").modal('hide');
    };
    
    $scope.playLecture = function(lecture){
        if(!lecture.Soid){
            $scope.Account.createLecture(lecture).then(function(response){
                $scope.Account.watch(response.data.data.Soid);
            });
        }else
            $scope.Account.watch(lecture.Soid);  
    };
    
    $scope.test = function(lecture){
        $scope.Account.test(lecture.Soid);
    };
    
    $scope.print = function(lecture){
        $scope.Account.print(lecture.Soid);  
    };
    
}]);