/* global angular */

angular.module('mariposa-training').service('TmpStorage', ['$http', '$q', 'Session', 'Account', 'USER_ROLES',
  function ($http, $q, Session, Account, USER_ROLES) {

  this.storeAccountData = function(info, userId){
    return $http.post("/registrations/", {
      registration: {
        first_name: info.FirstName,
        last_name: info.LastName,
        email_address: info.EmailAddress,
        facility_soid: info.FacilitySoid,
        facility: info.Facility,
        associations: info.Associations || [],
        roles: info.Roles || [],
        user_id: userId
      }
    });
  };
}]);