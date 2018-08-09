/* global angular */

angular.module('mariposa-training').service('Session', ['$sessionStorage', '$state', function ($sessionStorage, $state) {

  this.showLoginForm = false;

  this.create = function (userId, userRoles, userName) {
    this.userId = userId;
    this.userRoles = userRoles;
    this.userName = userName;
    this.showLoginForm = false;
    $sessionStorage.identifier = userId;
    $sessionStorage.userRoles = userRoles;
  };

  this.destroy = function () {
    this.userId = null;
    this.userRoles = null;
    this.userName = null;
    this.member = null;
    $sessionStorage.$reset();
  };

  this.addMemberObject = function(memberObj){

    if($state.current.name.indexOf("Succeed") != -1) return;
    if(memberObj){
      var date = new Date(memberObj.LicenseRenewalDate);
      this.member = memberObj;
      this.member.LicenseRenewalDate = date;
      $sessionStorage.member = this.member;
      this.showLoginForm = false;
    }
  };

  this.addUserId = function(userId){

    if($state.current.name.indexOf("Succeed") != -1) return;

    this.userId = userId;
    $sessionStorage.identifier = userId;
    this.showLoginForm = false;
  };

  this.addUserObject = function(userObj){

    if($state.current.name.indexOf("Succeed") != -1) return;

    this.user = userObj;
    $sessionStorage.user = userObj;
    this.showLoginForm = false;
  };

  this.setNeedsInfo = function(val){
    this.needsInfo = val;
  };

  this.setNeedsState = function(val){
    this.needsState = val;
  };

  this.loadFromSessionStorage = function(){

    if($state.current.name.indexOf("Succeed") != -1) return;

    this.userId = $sessionStorage.identifier;
    this.user = $sessionStorage.user;
    this.userRoles = $sessionStorage.userRoles;
    this.member = $sessionStorage.member;

    if(this.member && !(this.member.LicenseRenewalDate instanceof Date))
      this.member.LicenseRenewalDate = new Date(this.member.LicenseRenewalDate);
  };
}]);