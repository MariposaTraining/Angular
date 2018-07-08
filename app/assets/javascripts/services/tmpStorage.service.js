/* global angular */

angular.module('mariposa-training').service('TmpStorage', ['$http', '$q', 'Session', 'Account', 'USER_ROLES', 
  function ($http, $q, Session, Account, USER_ROLES) {
  
  this.storeAccountData = function(info, userId){
    return $http.post("/registrations/", {
      registration: {
        first_name: info.firstName,
        last_name: info.lastName,
        email_address: info.emailAddress,
        facility_soid: info.facilitySoid,
        facility: info.facility,
        associations: info.associations,
        roles: info.roles,
        user_id: userId
      }
    });
  };
}]);