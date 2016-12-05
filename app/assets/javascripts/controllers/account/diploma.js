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
        $scope.showRetakeBtn = false;
        
        if($state.current.name.indexOf("Succeed") != -1)
            $scope.fullName = $state.params["fullName"].replaceAll("_", " ");
        else
            $scope.fullName = $scope.Session.member.NameFull;
        
        if($state.params.lectureSoid){
            lectureSoid = $state.params.lectureSoid;
            if(!$state.current.name.indexOf("Succeed") != -1)
                $localStorage.lectureSoidToReload = lectureSoid;
        }else if($localStorage.lectureSoidToReload && $state.current.name.indexOf("Succeed") != -1){
            $scope.showTestResults = true;
            lectureSoid = $localStorage.lectureSoidToReload;
        }
        
        $scope.Account.loadLectureBySoid(lectureSoid).then(function success(result){
            $scope.lecture = result.data.data;
            $scope.testPassed = result.data.data.Tests.filter(function(el){
                return el.Pass;
            }).length > 0;
            if($state.current.name.indexOf("Succeed") != -1)
                $scope.lecture.Tests = $scope.lecture.Tests.map(function(el){
                    var v = el.AdmisteredOn.substr(6, 13);
                    el.AdmisteredOn = new Date(Number(v));
                    return el;
                });
            $scope.showRetakeBtn = !$scope.testPassed;
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
            
            if(!response.data.ok)
                $scope.errorMessage = response.data.message;
            else{
                $scope.errorMessage = null;
                $scope.enteredName = null;
                $scope.showNameForm = false;
                if($state.current.name.indexOf("Succeed") != -1)
                    $scope.link = "http://ec2-54-67-60-169.us-west-1.compute.amazonaws.com:9000/documents/ceu/" + response.data.data + ".pdf";
                else
                    $scope.link = "http://ec2-54-67-60-169.us-west-1.compute.amazonaws.com:9000/documents/ceu/" + response.data.data + ".pdf";
            }
            }, function error(response){
            $scope.errorMessage = response.data.data;
            console.log(response);
        });
    };
    
    $scope.retakeTest = function(){
        if($scope.lecture && $scope.lecture.Soid)
            $scope.Account.test($scope.lecture.Soid);  
    };
    
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };
    
}]);