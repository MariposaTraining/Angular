/* global angular */

angular.module('mariposa-training').service('Management', ['$http', '$q', '$window', 'Account', 'Session', 'USER_ROLES', 
    function ($http, $q, $window, Account, Session, USER_ROLES) {
    
    this.facilities = [];
    this.managerCourses = [];
    this.managerCoursesAttemptedLoad = false;
    this.facilitiesLoaded = false;
    this.facilityReloaded = false;
    
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
                        for(var i = 0; i < response.data.data.length; i++)
                            addFacility(response.data.data[i]);
                        self.facilitiesLoaded = true;
                        self.facilities = self.facilities.sort(function(f1, f2){return f1.Name.localeCompare(f2.Name)});       
                    }
                    return response;
                }, function error(response){
                    console.log(response);
                    return response;
                });
            }else{
                return null;
            }
        }
        
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
            response.data.Students.sort(function(p1, p2) {return p1.FullName.localeCompare(p2.FullName)});
            response.data.Dropped = response.data.Dropped.map(function(el){
                el.CreatedOn = getDateStringFromISOString(el.CreatedOn);
                return el;
            }).sort(function(p1, p2){return p1.FullName.localeCompare(p2.FullName)});
            self.facilities[i] = response.data;
            self.facilityReloaded = true;
        }
    };
    
    var addFacility = function(facility){
        if(facility.Students)
            facility.Students.sort(function(p1, p2) {return p1.FullName.localeCompare(p2.FullName)});
        if(facility.Dropped)
            facility.Dropped = facility.Dropped.map(function(el){
                el.CreatedOn = getDateStringFromISOString(el.CreatedOn);
                return el;
            }).sort(function(p1, p2){return p1.FullName.localeCompare(p2.FullName)});
        self.facilities.push(facility);
    };
    
    this.getFacility = function(facilitySoid){
        if(Session.userRoles && Session.userRoles.indexOf(USER_ROLES.manager) != -1 && Session.userId != null){
            return $http.post("/Api/GetManagerFacility", {memberSoid: Session.userId, facilitySOID: facilitySoid});
        }else   
            return null;
    };
    
    this.print = function(lectureSoid){
        Account.getDiploma(lectureSoid).then(function(result){
            var link = "http://ec2-54-67-60-169.us-west-1.compute.amazonaws.com:9000/Documents/Continuing Education Unit/certificates/" + result.data.data + ".pdf";
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
    
}]);