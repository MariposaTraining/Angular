/* global angular */

angular.module('mariposa-training').service('AuthService', ['$http', '$q', 'Api', 'Session', 'Account', 'TmpStorage', 'USER_ROLES',
  function ($http, $q, Api, Session, Account, TmpStorage, USER_ROLES) {

  var getMember = function(){
    return $http.post('Api/getMember', {memberSoid: Session.userId}).then(function success(response){

        Session.addMemberObject(response.data.data);
        Account.processMemberObject(response.data);

        return response;
      }, function error(response){
        return response;
      });
  };

  var getNeeds = function(response){
    return $http.post("/Api/GetNeedsInfo", {memberSoid: Session.userId}).then(function(res){
      if(res.data.ok == true)
        Session.setNeedsInfo(res.data.data);

      return $http.post("/Api/GetNeedsState", {memberSoid: Session.userId}).then(function(res){
        if(res.data.ok == true)
          Session.setNeedsState(res.data.data);

        return response;
      });
    });
  };

  this.login = function (credentials) {
    return $http
      .post('Api/getLogin', credentials)
      .then(function (res) {
        if(res.data.ok == true){
          res.data = res.data.data;
          var userRoles = [];
          if(res.data.IsManager) userRoles.push(USER_ROLES.manager);
          if(res.data.IsStudent) userRoles.push(USER_ROLES.student);

          Session.create(res.data.MemberSoid, userRoles);

          return getMember().then(function(response){
            return getNeeds(response);
          });
        }else{
          return res;
        }
      });
  };

  this.roles = ["Administrator", "DON", "DSD", "BOM", "SSD", "AD", "Nurse", "CNA", "Medical Director", "Physician"];
  this.associations = ["CAHF", "QCHF", "CALTCM", "No Association"];

  this.register = function(info){
      return Api.register(info)
      .then(function success(res){
        if(typeof res.data == "string"){

          var userId = res.data;
          var userRoles = ["student"];

          Session.create(userId, userRoles, info.EmailAddress);
          Api.notifyRegistration(userId);

          return getMember().then(function(response){
            return getNeeds(response);
          }, function error(response){
            console.log(response);
            return response;
          });
        }else
          return res.data;
      }, function error(res){
        return res.data;
      });
  };

  var registerUser = function(info){
    return $http.post('Api/GetRegister', info);
  };

  this.registerByManager = function(info){
    return registerUser(info);
  };

  this.changePassword = function(credentials){
    return $http.post('Api/setChangePassword', credentials);
  };

  this.passwordRecovery = function(address){
    return $http.post('Api/setPasswordRecovery', {emailAddress: address});
  };

  this.setNewsletter = function(subscriber){
    return $http.post("Api/setNewsletter", {firstName: subscriber.firstName, lastName: subscriber.lastName, emailAddress: subscriber.emailAddress});
  };

}]);