/* global angular */

var app = angular.module('mariposa-training', ['ui.router', 'templates', 'ngSanitize', 'ngStorage', 'ngAudio'])
  .controller('ApplicationCtrl', ['$scope', '$state', '$sessionStorage', '$localStorage', '$rootScope', '$window', 'AuthService', 'Cart', 'Session', 'Catalog', 'Transaction', 'Account', 'Management', 'Layout', 'USER_ROLES', 'NO_ORGANIZATION_SOID',
  function($scope, $state, $sessionStorage, $localStorage, $rootScope, $window, AuthService, Cart, Session, Catalog, Transaction, Account, Management, Layout, USER_ROLES, NO_ORGANIZATION_SOID){
    
    $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){ 
        $sessionStorage.lastState = toState.name;
        if(toState.name != "player" && toState.name != "test") document.title = "Mariposa Training";
    });
   
    $scope.init = function(){
      $scope.Account = Account;
      $scope.Cart = Cart;
      $scope.Transaction = Transaction;
      $scope.Session = Session;
      $scope.Management = Management;
      $scope.isAuthorized = AuthService.isAuthorized;
      $scope.USER_ROLES = USER_ROLES;
      $scope.NO_ORGANIZATION_SOID = NO_ORGANIZATION_SOID;
      Catalog.getData();
  
      if($sessionStorage.identifier){ 
        $scope.Session.loadFromSessionStorage();
        Account.loadMemberObject();
      }
      
      if($sessionStorage.lastState && !$sessionStorage.newState) 
        $state.go($sessionStorage.lastState);
      else if($sessionStorage.newState) 
        $state.go($sessionStorage.newState, {lectureSoid: $localStorage.lectureSoidToReload});
      
      $scope.Cart.getCart();
      $scope.$state = $state;
      Layout.init();
    };
    
    $scope.init();
    
    $scope.signOut = function(){
      $scope.Cart.removeAllItems();
      $scope.Session.destroy(); 
      $scope.Transaction.destroy();
      $scope.Account.destroy();
      $scope.Management.destroy();
      $state.go('home');
    };
    
    $scope.homeLinkClicked = function(){
      if($scope.Session.userId != null)
        $state.go("accountNew");
      else
        $state.go("home");
    };
    
    $scope.reloadPage = function(){
      $window.location.reload();
    };
    
}]);

app.constant('USER_ROLES', (function() {
    return {
      manager: 'manager',
      student: 'student'
    };
})());

app.constant('NO_ORGANIZATION_SOID', (function() {
    return "5760ddf5eabbde0e0cdbff47";
})());

app.constant('ITEM_TYPES', (function() {
    return {
      course: 1,
      certification: 2,
      bundle: 3
    };
})());

app.constant('US_STATES', (function() {
    return {
      vals: [
        {value: 'AL', name: 'Alabama'},
        {value: 'AK', name: 'Alaska'},
        {value: 'AZ', name: 'Arizona'},
        {value: 'AR', name: 'Arkansas'},
        {value: 'CA', name: 'California'},
        {value: 'CO', name: 'Colorado'},
        {value: 'CT', name: 'Connecticut'},
        {value: 'DE', name: 'Delaware'},
        {value: 'FL', name: 'Florida'},
        {value: 'GA', name: 'Georgia'},
        {value: 'HI', name: 'Hawaii'},
        {value: 'ID', name: 'Idaho'},
        {value: 'IL', name: 'Illinois'},
        {value: 'IN', name: 'Indiana'},
        {value: 'IA', name: 'Iowa'},
        {value: 'KS', name: 'Kansas'},
        {value: 'KY', name: 'Kentucky'},
        {value: 'LA', name: 'Louisiana'},
        {value: 'ME', name: 'Maine'},
        {value: 'MD', name: 'Maryland'},
        {value: 'MA', name: 'Massachusetts'},
        {value: 'MI', name: 'Michigan'},
        {value: 'MN', name: 'Minnesota'},
        {value: 'MS', name: 'Mississippi'},
        {value: 'MO', name: 'Missouri'},
        {value: 'MT', name: 'Montana'},
        {value: 'NE', name: 'Nebraska'},
        {value: 'NV', name: 'Nevada'},
        {value: 'NH', name: 'New Hampshire'},
        {value: 'NJ', name: 'New Jersey'},
        {value: 'NM', name: 'New Mexico'},
        {value: 'NY', name: 'New York'},
        {value: 'NC', name: 'North Carolina'},
        {value: 'ND', name: 'North Dakota'},
        {value: 'OH', name: 'Ohio'},
        {value: 'OK', name: 'Oklahoma'},
        {value: 'OR', name: 'Oregon'},
        {value: 'PA', name: 'Pennsylvania'},
        {value: 'RI', name: 'Rhode Island'},
        {value: 'SC', name: 'South Carolina'},
        {value: 'SD', name: 'South Dakota'},
        {value: 'TN', name: 'Tennessee'},
        {value: 'TX', name: 'Texas'},
        {value: 'UT', name: 'Utah'},
        {value: 'VT', name: 'Vermont'},
        {value: 'VA', name: 'Virginia'},
        {value: 'WA', name: 'Washington'},
        {value: 'WV', name: 'West Virginia'},
        {value: 'WI', name: 'Wisconsin'},
        {value: 'WY', name: 'Wyoming'}
      ]
    };
    
})());

app.constant('TIME_ZONES', (function() {
    return {
      vals: [
        {value: "Hawaiian Standard Time", label: "(UTC-10:00) Hawaii"},
        {value: "Alaskan Standard Time", label: "(UTC-09:00) Alaska"},
        {value: "Pacific Standard Time", label: "(UTC-08:00) Pacific Time"},
        {value: "US Mountain Standard Time", label: "(UTC-07:00) Arizona"},
        {value: "Mountain Standard Time", label: "(UTC-07:00) Mountain Time"},
        {value: "Central Standard Time", label: "(UTC-06:00) Central Time"},
        {value: "Canada Central Standard Time", label: "(UTC-06:00) Saskatchewan"},
        {value: "Eastern Standard Time", label: "(UTC-05:00) Eastern Time"},
        {value: "US Eastern Standard Time", label: "(UTC-05:00) Indiana (East)"}
      ]
    };
    
})());


