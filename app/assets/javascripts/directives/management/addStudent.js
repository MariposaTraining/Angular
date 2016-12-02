/* global angular */

angular.module("mariposa-training")
    .directive("addStudent", ['$timeout', 'Management', 'AuthService', 
    function($timeout, Management, AuthService){
        
        function link(scope, element, attrs){
            
            scope.student = {};
            scope.passwordGenerated = {};
            
            scope.clearStudent = function(){
                
                scope.student = {
                    firstName: "",
                    lastName: "",
                    emailAddress: "",
                    password: "",
                    facilitySoid: ""    
                };
            };
            
            
            scope.clearStudent();
            
            scope.Management = Management;
            
            scope.close = function(){
                scope.clearStudent();
                scope.okMessage = null;
                scope.errorMessage = null;
                scope.visible = false;
            };
            
            scope.register = function(){
                AuthService.registerByManager(scope.student).then(function(response){
                    if(response.data.ok){
                        scope.errorMessage = null;
                        Management.reloadFacility(scope.student.facilitySoid);
                        scope.okMessage = "The user with the email address '" + scope.student.emailAddress + "' is successfully registered.";
                        $timeout(function(){
                            scope.okMessage = null;
                        }, 3000);
                        scope.clearStudent();
                    }else{
                        scope.errorMessage = response.data.message;
                        scope.okMessage = null;
                    }
                });
            };
            
        }
        
        return{
            scope: {
                visible: '=visible'
            },
            restrict: 'A',
            templateUrl: "directive/manager/addStudent.html",
            link: link
        };
    }]);
