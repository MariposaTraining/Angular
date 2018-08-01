/* global angular */

angular.module('mariposa-training').controller('AccountCtrl', ['$scope', '$state', '$timeout', 'TmpStorage', '$q', '$window', 'Account', 'Session', 'PersonalInfo', 'Logger', 'AuthService', 'US_STATES', 'TIME_ZONES',
    function ($scope, $state, $timeout, TmpStorage, $q, $window, Account, Session, PersonalInfo, Logger, AuthService, US_STATES, TIME_ZONES) {
  
    $scope.init = function(){
        
        $scope.US_STATES = US_STATES;
        $scope.Session = Session;
        $scope.TIME_ZONES = TIME_ZONES;
        $scope.Account = Account;
        
        $scope.facility = null;
        $scope.tmpAssoc = null;
        $scope.assocCheckbox = [];
        
        $scope.associations = AuthService.associations;
        
        PersonalInfo.getStudentTypes().then(function(res){
            if(res.data.ok == true)
                $scope.studentTypes = res.data.data;
        });
        
        if($state.current.name == 'accountNew' && $scope.Session.needsInfo){
            
            $scope.timeZone = $scope.Session.member.TimeZone;
            $scope.studentType = $scope.Session.member.StudentTypeSoid;
            $scope.licenseState = $scope.Session.member.LicenseState;
            $scope.licenseRenewalDate = $scope.Session.member.LicenseRenewalDate;
            
            $timeout(function(){
                $("#studentInfo").modal({backdrop: 'static', keyboard: false});
            }, 1600);
            
        }else if($state.current.name == 'accountNew' && $scope.Session.needsState){
            
            $scope.state = $scope.Session.member.LicenseState;
            $scope.Session.setNeedsState(false);
            $timeout(function(){
                $("#stateInfo").modal({backdrop: 'static', keyboard: false});
            }, 1600);
        }
        
        $scope.Account.sortCourses();
    
        $scope.associationsFilled = false;
            
        if(Account.reloadNeeded)
            Account.reloadMemberObject();
        
        /*angular.element($window).bind('focus', function() {
                      
        });
        */
    };
    
    $scope.init();
    
    $scope.checkAssociations = function(){
        
        var tmp = 0;
        
        for(var i = 0; i < $scope.assocCheckbox.length; i++){
            if($scope.assocCheckbox[i])
                tmp++;
        }
        
        if($scope.tmpAssoc && $scope.tmpAssoc.trim() != "")
            tmp++;
            
        if(tmp > 0)
            $scope.associationsFilled = true;
        else
            $scope.associationsFilled = false;
    };
    
    $scope.saveState = function(){
        PersonalInfo.setStudentState($scope.Session.userId, $scope.state).then(function(response){
            PersonalInfo.loadMemberObject(false);
        });
        $("#stateInfo").modal('hide');
    };
    
    var extractActiveAssociations = function(){
        var assocs = [];
        
        for(var i=0; i<$scope.associations.length; i++){
            if($scope.assocCheckbox[i])
                assocs.push($scope.associations[i]);
        }
        
        if($scope.tmpAssoc && $scope.tmpAssoc.trim() != "")
            assocs.push($scope.tmpAssoc.trim());
            
        return assocs;
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
        
        TmpStorage.storeAccountData({
            facility: $scope.facility,
            associations: extractActiveAssociations()
        }, $scope.Session.userId);
        
        $scope.facility = null;
        $scope.tmpAssoc = null;
        $scope.assocCheckbox = [];
        
        PersonalInfo.setStudentInfo(studentInfo).then(function(){
            PersonalInfo.loadMemberObject(true);
        });
        $("#studentInfo").modal('hide');
        $scope.Session.setNeedsInfo(false);
        $scope.Session.setNeedsState(false);
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
                $scope.Account.play(response.data.data.Soid);
            });
        }else
            $scope.Account.play(lecture.Soid);  
    };
    
    $scope.test = function(lecture){
        Logger.logData("AccountCtrl: test called on lecture " + lecture.Soid, JSON.stringify(lecture));
        $scope.Account.test(lecture.Soid);
    };
    
    $scope.print = function(lecture){
        $scope.Account.print(lecture.Soid);  
    };
    
}]);