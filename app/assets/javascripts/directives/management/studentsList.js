/* global angular */

angular.module("mariposa-training")
    .directive("studentsList", ['$window', '$timeout', 'AuthService', 'Management', 'PersonalInfo', 'Session', 'Account',
    function($window, $timeout, AuthService, Management, PersonalInfo, Session, Account){
        
        function link(scope, element, attrs){
            scope.updatePage = function(i){
                var tmp = scope.currentPage + i;
                if(tmp != 0 && tmp <= scope.pagesNumber){
                    scope.currentPage = tmp;
                    var start = scope.numPerPage * (scope.currentPage - 1);
                    scope.displayedStudents = scope.students.slice(start, start + scope.numPerPage);
                }
            };
            
            scope.toggleEdit = function(parentIndex, index, student){
                scope.showEdit[parentIndex][index] = !scope.showEdit[parentIndex][index];
                if(scope.showEdit[parentIndex][index])
                    loadMember(parentIndex, index, student.Soid);
            };
            
            var loadMember = function(parentIndex, index, soid){
                
                PersonalInfo.getMember(soid).then(function success(response){
                    if(scope.tmpMember[parentIndex][index] == null)
                        scope.tmpMember[parentIndex][index] = {};
                    scope.tmpMember[parentIndex][index].Soid = soid;
                    scope.tmpMember[parentIndex][index].NameFirst = response.data.data.NameFirst;
                    scope.tmpMember[parentIndex][index].NameLast = response.data.data.NameLast;
                    scope.tmpMember[parentIndex][index].FacilitySoid = response.data.data.FacilitySoid;
        
                    extractLectures(scope.tmpMember[parentIndex][index], response.data.data.Lectures);
                    
                    AuthService.getUser(soid).then(function success(response){
                        scope.tmpMember[parentIndex][index].EmailAddress = response.data.data.EmailAddress;
                        scope.tmpMember[parentIndex][index].LastAccessedOn = getDateStringFromISOString(response.data.data.LastAccessedOn);
                        scope.tmpMember[parentIndex][index].CreatedOn = getDateStringFromISOString(response.data.data.CreatedOn);
                    });
                    
                }, function error(response){
                    console.log(response);
                });
            }
            
            var getDateStringFromISOString = function(str){
                var v = (new Date(Number(str.substr(6, 13))));
                return v.getMonth()+1 + "/" + v.getDate() + "/" + v.getFullYear();
            };
            
            var extractLectures = function(member, lectures){
                member.Lectures = {
                    completed: [],
                    incomplete: [],
                    archived: [],
                    scheduled: [],
                    inQueue: []
                };
                
                for(var i = 0; i < lectures.length; i++){
                    if(lectures[i].TakenOn) lectures[i].TakenOn = getDateStringFromISOString(lectures[i].TakenOn);
                    switch(lectures[i].Status){
                        case "Completed": member.Lectures.completed.push(lectures[i]); break;
                        case "Incomplete": member.Lectures.incomplete.push(lectures[i]); break;
                        case "InQueue": member.Lectures.inQueue.push(lectures[i]); break;
                        case "Archived": member.Lectures.archived.push(lectures[i]); break;
                        case "Scheduled": member.Lectures.scheduled.push(lectures[i]); break;
                    }  
                }
            };
            
            scope.updateField = function(fieldName, fieldValue, memberSoid, parentIndex, index){
                
                PersonalInfo.managerUpdateField(fieldName, fieldValue, memberSoid).then(function success(response){
                    if(fieldName == "FacilitySoid" && response.data.ok){
                        $window.location.reload();
                    }else{
                        scope.memberSoid = memberSoid;
                        scope.fieldName = fieldName;
                        
                        scope.fieldSaved = response.data.ok;
                        
                        if((fieldName == "NameLast" || fieldName == "NameFirst") && scope.fieldSaved){
                            scope.Management.facilities[parentIndex].Students[index].FullName = scope.tmpMember[parentIndex][index].NameFirst + " " + scope.tmpMember[parentIndex][index].NameLast;
                        }
                        
                        if(scope.memberSoid == Session.userId)
                            Account.reloadMemberObject();
                        
                        hideOnTimeout();
                    }
                }, function error(response){
                    scope.memberSoid = memberSoid;
                    scope.fieldName = fieldName;
                    
                    scope.fieldSaved = false;
                    
                    console.log(response);
                    
                    hideOnTimeout();
                });
                
            };
            
            scope.updatePassword = function(memberSoid, newpsw){
                AuthService.changePassword({memberSoid: memberSoid, password: newpsw}).then(function(response){
                    scope.fieldSaved = response.data.ok;
                    scope.fieldName = "password";
                    scope.memberSoid = memberSoid;
                    
                    hideOnTimeout();
                });
            };
            
            var hideOnTimeout = function(){
                $timeout(function () {
                    scope.memberSoid = null;
                    scope.fieldName = null;
                    scope.fieldSaved = false;
                }, 2000);
            };
            
            scope.isValidDate = function(str){
                if(!str) return false;
                var i = str.lastIndexOf('/');
                var y = str.substr(i+1,4);
                if(Number(y) > 2000)
                    return true;
                else
                    return false;
            };
            
            scope.print = function(lectureSoid){
                scope.Management.print(lectureSoid);
            };
            
            scope.schedule = function(parentIndex, index){
                scope.tmpMember[parentIndex][index].dateToSchedule = new Date(scope.tmpMember[parentIndex][index].dateToSchedule);
                
                var date = scope.tmpMember[parentIndex][index].dateToSchedule.getMonth()+1 + "/" + scope.tmpMember[parentIndex][index].dateToSchedule.getDate() + "/" + scope.tmpMember[parentIndex][index].dateToSchedule.getFullYear();
                
                scope.Management.scheduleCourseForMember(scope.tmpMember[parentIndex][index].Soid, scope.tmpMember[parentIndex][index].courseSoidToSchedule, date).then(function(response){
                    scope.fieldName = "courseScheduled";
                    scope.fieldSaved = response.data.ok;
                    scope.memberSoid = scope.tmpMember[parentIndex][index].Soid;
                    if(response.data.ok){
                        scope.tmpMember[parentIndex][index].dateToSchedule = null;
                        scope.tmpMember[parentIndex][index].courseSoidToSchedule = null;
                        
                        loadMember(parentIndex, index, scope.tmpMember[parentIndex][index].Soid);
                    }
                    
                    if(scope.memberSoid == Session.userId)
                        Account.reloadMemberObject();
                    
                    hideOnTimeout();
                    scope.Management.managerCoursesAttemptedLoad = false;
                }, function(response){
                    scope.fieldName = "courseScheduled";
                    scope.fieldSaved = response.ok;
                    hideOnTimeout();
                });
            };
            
            scope.deactivate = function(parentIndex, index, facilitySoid){
                scope.Management.deactivate(scope.tmpMember[parentIndex][index].Soid).success(function(response){
                    scope.Management.reloadFacility(facilitySoid);
                    clearTmpMember();
                });
            };
            
            scope.revokeManager = function(parentIndex, index, facilitySoid){
                scope.Management.revokeManager(scope.tmpMember[parentIndex][index].Soid).success(function(response){
                    scope.Management.reloadFacility(facilitySoid);
                    clearTmpMember();
                });;
            };
            
            scope.sendPassword = function(parentIndex, index){
                scope.Management.sendPassword(scope.tmpMember[parentIndex][index].Soid).then(function success(response){
                    scope.fieldName = 'passwordSent';
                    scope.fieldSaved = true;
                    scope.memberSoid = scope.tmpMember[parentIndex][index].Soid;
                    hideOnTimeout();
                }, function error(response){
                    scope.fieldName = 'passwordSent';
                    scope.fieldSaved = false;
                    scope.memberSoid = scope.tmpMember[parentIndex][index].Soid;
                    hideOnTimeout();
                });
            };
            
            var clearTmpMember = function(){
                scope.showEdit = [];
                scope.tmpMember = [];
                for(var i = 0; i < 20; i++){
                    scope.showEdit.push([]);
                    scope.tmpMember.push([]);
                    for(var j = 0; j < 100; j++)
                        scope.tmpMember[i].push([]);
                }
            };
            
            scope.init = function(){

                for(var c = 0; c < scope.students.length; c++)
                    scope.students[c].studentIndex = c;

                scope.pagesNumber = Math.ceil(scope.students.length / scope.numPerPage);                
                scope.currentPage = 1;    
                scope.updatePage(0);
                clearTmpMember();
                
                scope.Management = Management;
                
            };
            
            scope.init();
        }
        
        return{
            scope: {
                students: '=students',
                facilityIndex: '=facilityIndex',
                numPerPage: '=numPerPage'
            },
            restrict: 'A',
            templateUrl: "directive/manager/studentsList.html",
            link: link
        };
    }]);
