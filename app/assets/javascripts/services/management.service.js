/* global angular, BACKEND_URL */

angular.module('mariposa-training').service('Management', ['$http', '$q', '$window', 'Account', 'Session', 'USER_ROLES', 
    function ($http, $q, $window, Account, Session, USER_ROLES) {
    
    this.facilities = [];
    this.managerCourses = [];
    this.managerCoursesAttemptedLoad = false;
    this.facilitiesLoaded = false;
    this.facilityReloaded = false;
    this.studentsLoadedCount = {};
    this.allStudents = [];
    
    var self = this;
    
    this.destroy = function(){
        self.facilities = [];
        self.managerCourses = [];
        self.managerCoursesAttemptedLoad = false;
        self.facilitiesLoaded = false;
    };
    
    this.getManagerCourses = function(){
        if(Session.userRoles && Session.userRoles.indexOf(USER_ROLES.manager) != -1 && Session.userId != null){
            
            if(self.managerCoursesAttemptedLoad)
                return this.managerCourses;
            else{            
                self.managerCoursesAttemptedLoad = true;
                return $http.post("/Api/GetManagerCourses", {memberSoid: Session.userId}).then(function(response){
                    if(response.data.ok){
                        self.managerCourses = response.data.data.sort(function(c1,c2){return c1.Name.localeCompare(c2.Name)});
                        processStudentsForCourses();
                    }else{
                        self.managerCourses = [];
                    }
                    return self.managerCourses;
                }, function(response){
                    self.managerCourses = [];
                    return self.managerCourses;
                });
            }
        }else
            return null;
    };
    
    var processStudentsForCourses = function(){
        if(self.managerCourses)
            for(var i = 0; i < self.managerCourses.length; i++){
                self.managerCourses[i].SortedStudents = {
                    completed: [],
                    incomplete: [],
                    inQueue: [],
                    archived: [],
                    scheduled: []
                };
                
                if(self.managerCourses[i].Students)
                    for(var j = 0; j < self.managerCourses[i].Students.length; j++){
                        
                        if(self.managerCourses[i].Students[j].FirstName && self.managerCourses[i].Students[j].LastName)
                            self.managerCourses[i].Students[j].NameFull = self.managerCourses[i].Students[j].LastName + " " + self.managerCourses[i].Students[j].FirstName;
                        else{
                            var tmpIndex = indexOfObject(self.allStudents, self.managerCourses[i].Students[j].Soid);
                            if(tmpIndex != -1)
                                self.managerCourses[i].Students[j].NameFull = self.allStudents[tmpIndex].FullName;
                        }
                        
                        if(self.managerCourses[i].Students[j].TakenOn){
                            var v = new Date(Number(self.managerCourses[i].Students[j].TakenOn.substr(6, 13)));
                            self.managerCourses[i].Students[j].TakenOn = v.getMonth() + 1 + " / " + v.getDate() + " / " + v.getFullYear();
                        }else if(self.managerCourses[i].Students[j].ScheduledOn){
                            var v = new Date(Number(self.managerCourses[i].Students[j].ScheduledOn.substr(6, 13)));
                            self.managerCourses[i].Students[j].ScheduledOn = v.getMonth() + 1 + " / " + v.getDate() + " / " + v.getFullYear();
                        }
                        
                        switch(self.managerCourses[i].Students[j].Status){
                            case "Completed": self.managerCourses[i].SortedStudents.completed.push(self.managerCourses[i].Students[j]); break;
                            case "Incomplete": self.managerCourses[i].SortedStudents.incomplete.push(self.managerCourses[i].Students[j]); break;
                            case "InQueue": self.managerCourses[i].SortedStudents.inQueue.push(self.managerCourses[i].Students[j]); break;
                            case "Archived": self.managerCourses[i].SortedStudents.archived.push(self.managerCourses[i].Students[j]); break;
                            case "Scheduled": self.managerCourses[i].SortedStudents.scheduled.push(self.managerCourses[i].Students[j]); break;
                        }
                    }
                    
                    self.managerCourses[i].SortedStudents.completed.sort(function(p1, p2) {
                        if(p1.NameFull && p2.NameFull)
                            return p1.NameFull.localeCompare(p2.NameFull);
                        else
                            return true;
                    });
                    self.managerCourses[i].SortedStudents.incomplete.sort(function(p1, p2) {
                        if(p1.NameFull && p2.NameFull)
                            return p1.NameFull.localeCompare(p2.NameFull);
                        else
                            return true;
                    });
                    self.managerCourses[i].SortedStudents.inQueue.sort(function(p1, p2) {
                        if(p1.NameFull && p2.NameFull)
                            return p1.NameFull.localeCompare(p2.NameFull);
                        else
                            return true;
                    });
                    self.managerCourses[i].SortedStudents.archived.sort(function(p1, p2) {
                        if(p1.NameFull && p2.NameFull)
                            return p1.NameFull.localeCompare(p2.NameFull);
                        else
                            return true;
                    });
                    self.managerCourses[i].SortedStudents.scheduled.sort(function(p1, p2) {
                        if(p1.NameFull && p2.NameFull)
                            return p1.NameFull.localeCompare(p2.NameFull);
                        else
                            return true;
                    });
            }  
    };
    
    this.getFacilities = function(){
        if(Session.userRoles && Session.userRoles.indexOf(USER_ROLES.manager) != -1 && Session.userId != null)
            return $http.post("/Api/GetManagerFacilities", {memberSoid: Session.userId});
        else
            return null;
    };
    
    var getDateStringFromISOString = function(str){
        
        var regex = /\/Date\((\d+)\)\//;
        var v = str.match(regex);
        
        if(v != null){
            var date = new Date(parseInt(v[1]));
            return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear();
        }else{
            return "";
        }
    };
    
    this.getCompleteFacilities = function(){
        
        if(Session.userRoles && Session.userRoles.indexOf(USER_ROLES.manager) != -1){
            if(!self.facilitiesLoaded){
                return self.getFacilities().then(function sucess(response){
                    if(response.data.ok){
                        for(var i = 0; i < response.data.data.length; i++){
                            addFacility(response.data.data[i]);
                            addStudentsToList(self.facilities[i].Students);
                            addStudentsToList(self.facilities[i].Dropped);
                        }
                        self.facilitiesLoaded = true;
                        self.facilities = self.facilities.sort(function(f1, f2){return f1.Name.localeCompare(f2.Name)});       
                    }
                    return response;
                }, function error(response){
                    console.log(response);
                    return response;
                });
            }else{
                return $q.resolve(null);
            }
        }else
            return $q.resolve(null);
        
    };
    
    this.reloadFacility = function(facilitySoid){
    /*    self.facilities = self.facilities.filter(function(el) {
            return el.Soid != facilitySoid;
        });
        
        self.getFacility(facilitySoid).success(addFacility);
        self.facilities = self.facilities.sort((f1, f2) => f1.Name.localeCompare(f2.Name)); */
        
        self.getFacility(facilitySoid).success(addReloadedFacility);
        
    };
    
    var addReloadedFacility = function(response){
        var i = 0;
        while(i < self.facilities.length && self.facilities[i].Soid != response.data.Soid) i++;
        if(i != self.facilities.length){
            self.facilities[i] = processFacility(response.data);
            self.facilityReloaded = true;
        }
    };
    
    var processFacility = function(facility){
        if(facility.Students){
            
            facility.Students = facility.Students.map(function(el){
                el.FullName = el.LastName + " " + el.FirstName;
                return el;
            });
            
            self.tmpStudents = facility.Students.filter(function(el){
                return !el.FullName && el.Soid;
            });
            
            var promise = [];
            
            if(self.tmpStudents && self.tmpStudents.length > 0){
                
                facility.loading = true;
                
                for(var i = 0; i < self.tmpStudents.length; i++){
                    promise[i] = $http.post("/Api/getMember", {memberSoid: self.tmpStudents[i].Soid}).then(function(response){
                        if(response.data.ok){
                            var index = indexOfObject(facility.Students, response.data.data.Soid);
                            facility.Students[index].FullName = response.data.data.NameFull;
                            facility.Students[index].CountCompleted = response.data.data.CountCompleted;
                        }
                    });
                    if(!self.tmpStudents[i].EmailAddres)
                        $http.post("/Api/getUser", {memberSoid: self.tmpStudents[i].Soid}).then(function(response){
                           if(response.data.ok){
                            var index = indexOfObject(facility.Students, response.data.data.Soid);
                            facility.Students[index].EmailAddress = response.data.data.EmailAddress;
                           } 
                        });
                }
                
                $q.all(promise).then(function(){
                    facility.Students.sort(function(p1, p2) {
                        if(p1.FullName && p2.FullName)
                            return p1.FullName.localeCompare(p2.FullName);
                        else
                            return true;
                    });
                    facility.loading = false;
                    
                    addStudentsToList(facility.Students);
                });
            }else{ 
                facility.Students.sort(function(p1, p2) {
                    if(p1.FullName && p2.FullName)
                        return p1.FullName.localeCompare(p2.FullName);
                    else
                        return true;
                });
            }
        }
        if(facility.Dropped)
            facility.Dropped = facility.Dropped.map(function(el){
                el.CreatedOn = getDateStringFromISOString(el.CreatedOn);
    
                if(el.LastName && el.FirstName)
                    el.FullName = el.LastName + " " + el.FirstName;
    
                return el;
            }).sort(function(p1, p2){
                if(p1.FullName && p2.FullName)
                    return p1.FullName.localeCompare(p2.FullName);
                else
                    return true;
            });
            
            return facility;
    };
    
    var addStudentsToList = function(newStudents){
        self.allStudents = self.allStudents.concat(newStudents);
    };
    
    var addFacility = function(facility){
        self.facilities.push(processFacility(facility));
    };
    
    this.getFacility = function(facilitySoid){
        if(Session.userRoles && Session.userRoles.indexOf(USER_ROLES.manager) != -1 && Session.userId != null){
            return $http.post("/Api/GetManagerFacility", {memberSoid: Session.userId, facilitySOID: facilitySoid});
        }else   
            return null;
    };
    
    this.print = function(lectureSoid){
        Account.getDiploma(lectureSoid).then(function(result){
            var link = BACKEND_URL + "/documents/ceu/" + result.data.data + ".pdf";
            $window.open(link);
        });
    };
    
    this.deactivate = function(memberSoid, facilitySoid){
        return $http.post("/Api/SetManagerStudentRemove", {memberSoid: memberSoid});
    };
    
    this.revokeManager = function(memberSoid){
        return $http.post("/Api/SetMemberUpdate", {memberSoid: memberSoid, fieldName: "IsEmployee", data: false});
    };
    
    this.sendPassword = function(memberSoid){
        return $http.post("/Api/SetManagerStudentSendCredentials", {memberSoid: memberSoid});
    };
    
    this.scheduleCourseForMember = function(memberSoid, courseSoid, date){
        return $http.post("/Api/SetManagerStudentCourseAssign", {memberSoid: memberSoid, courseSoid: courseSoid, scheduledOnStr: date}).success(function(response){
            return response;
        });  
    };
    
    this.recover = function(memberSoid, facilitySoid){
        return $http.post("/Api/SetManagerStudentRecover", {memberSoid: memberSoid, facilitySoid: facilitySoid});
    };
    
    var indexOfObject = function(arr, objSoid){
        var i = 0;
        while (i < arr.length && arr[i].Soid != objSoid) i++;
        if (i == arr.length) i = -1;
        return i;
    };
    
}]);