/* global angular */

angular.module('mariposa-training').service('Api', ['$http', '$q', 'Session', 'USER_ROLES',
  function ($http, $q, Session, USER_ROLES) {

  this.API_URL = "https://api.mariposatraining.com/api/";

  var headers = {
    'UserName': Session.userName ? Session.userName : "Guest",
    'UserSoid': Session.userId ? Session.userId : "",
    'Token': "{F0290832-DAAF-48B9-9A09-9C64CD824C2E}"
  };

  var self = this;

  this.register = function(data){

    if (data.hasOwnProperty("FirstName") && data.hasOwnProperty("LastName") && data.hasOwnProperty("EmailAddress") && data.hasOwnProperty("Password"))
      return $http({method: "POST",
                url: self.API_URL + "Member/Register",
                data: data,
                headers: headers
              });
    else
      return null;
  };

  this.notifyRegistration = function(memberSoid){

    if(memberSoid && memberSoid.trim() != "")
      return $http({method: "POST",
                url: self.API_URL + "Member/" + memberSoid + "/NotifyRegistration",
                headers: headers
              });
    else
      return null;
  };

}]);