/* global angular */

angular.module('mariposa-training').controller('DiplomaCtrl', ['$scope', '$state', '$q', '$sessionStorage', '$localStorage', '$window', 'Account', 'Session', 'PersonalInfo', 'US_STATES', 'TIME_ZONES',
    function ($scope, $state, $q, $sessionStorage, $localStorage, $window, Account, Session, PersonalInfo, US_STATES, TIME_ZONES) {
    
    $scope.init = function(){
        $sessionStorage.newState = null;
        $scope.Account = Account;
        $scope.Session = Session;
        $scope.lecture = null;
        $scope.showTestResults = false;
        
        var lectureSoid;
        $scope.showNameForm = false;
        $scope.detailedTest = null;
        $scope.enteredName = null;
        $scope.link = null;
        $scope.errorMessage = null;
        
        if($state.params.lectureSoid){
            lectureSoid = $state.params.lectureSoid;
            $localStorage.lectureSoidToReload = lectureSoid;
        }else if($localStorage.lectureSoidToReload){
            $scope.showTestResults = true;
            lectureSoid = $localStorage.lectureSoidToReload;
        }
        
        $scope.Account.loadLectureBySoid(lectureSoid).then(function success(result){
            $scope.lecture = result.data.data;
            $scope.testPassed = result.data.data.Tests.filter(function(el){
                return el.Pass;
            }).length > 0;
            console.log($scope.lecture);
        }, function error(result){
            console.log(result);
        });
        
    };
    
    $scope.init();
    
    $scope.setDetailedTest = function(test){
        if($scope.testPassed)
            $scope.detailedTest = test;
    };
    
    $scope.submit = function(){
        $scope.Account.getDiploma($scope.lecture.Soid).then(function success(response){
            $scope.errorMessage = null;
            $scope.enteredName = null;
            $scope.showNameForm = false;
            $scope.link = "http://ec2-54-67-60-169.us-west-1.compute.amazonaws.com:9000/Documents/Continuing Education Unit/certificates/" + response.data.data + ".pdf";
        }, function error(response){
            $scope.errorMessage = response.data.data;
            console.log(response);
        });
    };
    
    $scope.retakeTest = function(){
        if($scope.lecture && $scope.lecture.Soid)
            $scope.Account.test($scope.lecture.Soid);  
    };
    
}]);