/* global angular */

angular.module('mariposa-training').controller('PersonalInfoCtrl', 
  ['$scope', '$timeout', 'Session', 'AuthService', 'PersonalInfo', 'TIME_ZONES', 'US_STATES', '$sessionStorage',
  function ($scope, $timeout, Session, AuthService, PersonalInfo, TIME_ZONES, US_STATES, $sessionStorage) {
  
  $scope.init = function(){
    $('[data-toggle="tooltip"]').tooltip();
    $scope.Session = Session;
    $scope.psw = "";
    $scope.timeZones = TIME_ZONES.vals;
    $scope.US_STATES = US_STATES;
    $scope.selectedTimeZone = {
      val: $scope.timeZones[0]
    };
    $scope.PersonalInfo = PersonalInfo;
    $scope.storage = $sessionStorage;
    $scope.member = $scope.Session.member;
    $scope.studentTypes = [];
    $scope.watchCount = 0;
    
    PersonalInfo.getStudentTypes().then(function success(response){
      $scope.studentTypes = response.data.data;
    }, function error(response){
      console.log(response);
    }); 
    
    $scope.$watch('member.LicenseRenewalDate', function(){
      
      if($scope.watchCount > 0)
        $scope.updateField('LicenseRenewalDate', $scope.member.LicenseRenewalDate);
      
      $scope.watchCount++;  
      
    }, true);
    
  };
  
  $scope.init();
  
  $scope.updateFacility = function(isRelease){
    if(isRelease)
      $scope.PersonalInfo.updateFacility(null, $scope.member.Soid).then(function(){
        $scope.PersonalInfo.loadMemberObject(true);
      });
    else
      $scope.PersonalInfo.updateFacilityByCode($scope.Session.member.FacilityCode, $scope.member.Soid).then(function(){
        $scope.PersonalInfo.loadMemberObject(true);
      });;
  };
  
  $scope.changePassword = function(){
    if($scope.psw != null && $scope.psw != "")
      AuthService.changePassword({
        memberSoid: Session.userId,
        password: $scope.psw
      })
      .then(function success(response){
        $scope.success = true;
        $scope.error = false;
        $scope.message = "New password is saved.";
        $scope.psw = "";
      }, function error(response){
        $scope.success = false;
        $scope.error = true;
        $scope.message = "An error occurred. New password is not saved.";      
      });
  };
  
  var isFieldValid = function(fieldName, fieldValue){
    var valid = true;
    
    if((fieldName == 'NameFirst' || fieldName == 'NameLast') && (fieldValue == null|| fieldValue == ""))
      valid = false;
    else if((fieldName == 'Phone1' || fieldName == 'Phone2') && ((fieldValue != "" && fieldValue != null && !(fieldValue.match(/^[(][0-9]{3}[)] [0-9]{3}-[0-9]{4}$/))) || fieldValue == undefined))
      valid = false;
      
    return valid;
  };
  
  $scope.updateField = function(fieldName, fieldValue){
    
      if(isFieldValid(fieldName, fieldValue))
        $scope.PersonalInfo.updateField(fieldName, fieldValue).then(
          function success(response){
            
            $scope.fieldName = fieldName;
            $scope.fieldSaved = response.data.ok;
            
            updateModel(response, fieldName);
            hideOnTimeout();
              
          }, function error(response){
            $scope.fieldName = fieldName;
            $scope.fieldSaved = false;
            hideOnTimeout();
            console.log(response);
          });
      else{
        $scope.fieldName = fieldName;
        $scope.fieldSaved = false;
        hideOnTimeout();
      }
  };
  
  var updateModel = function(response, fieldName){

    var fn = fieldName;
    var resp = response;
    
    if($scope.member.hasOwnProperty(fn)){
        if(fn == 'YearHired')
          $scope.member['YearHired'] = parseInt(resp.data.data.Data);
        else if(fieldName == 'LicenseRenewalDate'){
          $scope.member["LicenseRenewalDate"] = new Date(resp.data.data.Data);
        }else if(fn == 'StudentTypeSoid')
          $scope.member['StudentTypeSoid'] = resp.data.data.Data;
        else
          $scope.member[fn] = resp.data.data.Data;
    }
      
      $scope.storage.member = $scope.member;
  };
  
  var hideOnTimeout = function(){
    $timeout(function () {
        $scope.fieldName = null;
        $scope.fieldSaved = false;
    }, 2000);
  };
    
}]);