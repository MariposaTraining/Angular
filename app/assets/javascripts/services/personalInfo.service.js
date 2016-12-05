/* global angular */

angular.module('mariposa-training').service('PersonalInfo', ['$http', 'Account', 'Session', 'Management', 'NO_ORGANIZATION_SOID', 'USER_ROLES', function ($http, Account, Session, Management, NO_ORGANIZATION_SOID, USER_ROLES) {
    
    var self = this;
    
    this.getStudentTypes = function(){
        return $http.post("/Api/GetStudentTypes");
    };
    
    this.getMember = function(memberSoid){
        return $http.post("/Api/GetMember", {memberSoid: memberSoid});
    };
    
    this.updateField = function(fieldName, fieldValue){
        var data = {
            memberSoid: Session.userId,
            fieldName: fieldName,
            data: fieldValue
        };
        
        return $http.post("/Api/SetMemberUpdate", data);
    };
    
    this.managerUpdateField = function(fieldName, fieldValue, memberSoid){
        var data = {
            memberSoid: memberSoid,
            fieldName: fieldName,
            data: fieldValue
        };
        
        return $http.post("/Api/SetMemberUpdate", data);
    };
    
    this.loadMemberObject = function(isUpdateAccount){
        $http.post("/Api/GetMember", {memberSoid: Session.userId}).then(function(response){
            Session.addMemberObject(response.data.data);
            if(isUpdateAccount)
                Account.processMemberObject(response.data.data);
        });
    };
    
    this.setStudentState = function(memberSoid, state){
        return $http.post("/Api/SetStudentState", {memberSoid: memberSoid, licenseState: state});  
    };
    
    this.setStudentInfo = function(studentInfo){
        if(Session.userRoles && Session.userRoles.indexOf(USER_ROLES.manager) != -1 && studentInfo.facilityCode)
            Management.facilitiesLoaded = false;
        return $http.post("/Api/SetStudentInfo", studentInfo);
    };
    
    this.updateFacilityByCode = function(facilityCode, memberSoid){
        if(Session.userRoles && Session.userRoles.indexOf(USER_ROLES.manager) != -1)
            Management.facilitiesLoaded = false;
        return $http.post("/Api/SetChangeFacilityByCode", {memberSoid: memberSoid, facilityCode: facilityCode});    
    };
    
    this.updateFacility = function(facilitySoid, memberSoid){
        if(Session.userRoles && Session.userRoles.indexOf(USER_ROLES.manager) != -1)
            Management.facilitiesLoaded = false;
    
        if(facilitySoid == null)
            return this.managerUpdateField("FacilitySoid", NO_ORGANIZATION_SOID, memberSoid);
        else
            return this.managerUpdateField("FacilitySoid", facilitySoid, memberSoid);
    };
    
}]);