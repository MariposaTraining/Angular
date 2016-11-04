/* global angular */

angular.module('mariposa-training').service('AuthService', ['$http', '$q', 'Session', 'Account', 'USER_ROLES', 
  function ($http, $q, Session, Account, USER_ROLES) {
  
  var getMember = function(){
    if(Session.userId != null)  
      return $http.post('Api/getMember', {memberSoid: Session.userId}).then(
        function success(response){
          if(response.data.hasOwnProperty("data"))
            response.data = response.data.data;
          
          Session.addMemberObject(response.data);
            
          return response;  
        }, function error(response){
          return response;
        });
    else
      return null;
  };
  
  this.getUser = function(soid){
      return $http.post('Api/getUser', {memberSoid: soid}).then(
        function success(response){
          return response;
        }, function error(response){
          return response;
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
          
          return $http.post('Api/getMember', {memberSoid: res.data.MemberSoid})
            .then(function(res){
              
              if(res.data.hasOwnProperty("data"))
                res.data = res.data.data;
              
              Session.addMemberObject(res.data);
              
              Account.processMemberObject(res);
              
              return $http.post('Api/getUser', {memberSoid: res.data.Soid})
              
              .then(function(res){
                
                Session.addUserObject(res.data.data);
                
                var response = res;
                
                return $http.post("/Api/GetNeedsInfo", {memberSoid: Session.userId}).then(function(res){
                  if(res.data.ok == true)
                    Session.setNeedsInfo(res.data.data);
                    
                  return $http.post("/Api/GetNeedsState", {memberSoid: Session.userId}).then(function(res){
                    if(res.data.ok == true)
                      Session.setNeedsState(res.data.data);
                      
                    return response;
                  });
                });
              });
            });
                  
        }else{
          return res;
        }
      });
  };
  
  this.checkEmailAddress = function(email){
    return $http
      .post('Api/GetEmailAddressExists', {emailAddress: email});
  };
 
  this.register = function(info){
      return registerUser(info)
      .then(function success(res) {
        
        var userId = res.data.data;
        
        Session.addUserId(userId);
        
        return $http.post('Api/GetMember', {memberSoid: userId})
                .then(function(res){
                  Session.addMemberObject(res.data.data);
                    
                  Account.processMemberObject(res.data.data);
                  
                  return $http.post('Api/GetUser', {memberSoid: res.data.data.Soid})
                  .then(function(res){
                    Session.addUserObject(res.data.data);
                    
                    var response = res;
                
                    return $http.post("/Api/GetNeedsInfo", {memberSoid: Session.userId}).then(function(res){
                      if(res.data.ok == true)
                        Session.setNeedsInfo(res.data.data);
                        
                      return $http.post("/Api/GetNeedsState", {memberSoid: Session.userId}).then(function(res){
                        if(res.data.ok == true)
                          Session.setNeedsState(res.data.data);
                          
                        return response;
                      });
                    });
                  });
                });
      },
      function error(res){
        console.log(res);
        return res;
      });  
  }
  
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