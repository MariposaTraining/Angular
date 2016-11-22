/* global angular */
/* global PLAYER_URL, SITE_URL */

angular.module('mariposa-training').service('Account', ['$http', '$window', '$sessionStorage', '$localStorage', '$state', 'Session', 'Catalog', 
    function ($http, $window, $sessionStorage, $localStorage, $state, Session, Catalog) {
    
    this.valid = false;
    
    this.basicItems = {
        incomplete: [],
        completed: [],
        inQueue: [],
        archived: [],
        scheduled: [],
        certifications: []
    };
    
    this.items = {
        incomplete: [],
        completed: [],
        inQueue: [],
        archived: [],
        scheduled: [],
        certifications: []
    };
    
    var self = this;
    
    this.destroy = function(){
        self.items = {
            incomplete: [],
            completed: [],
            inQueue: [],
            archived: [],
            scheduled: [],
            certifications: []
        };  
        self.valid = false;
    };
    
    this.loadLectureBySoid = function(soid){
        if(!$state.current.name.includes("Succeed")){
            if(self.valid == false){
                return self.loadMemberObject().then(function(response){
                    return loadLecture(soid);
                });
            }else
                return loadLecture(soid);
        }else{
            return $http.post('/Api/GetLecture', {lectureSoid: soid}); 
        }        
    };
    
    var loadLecture = function(soid){
        return $http.post("/Api/GetLecture", {lectureSoid: soid}).then(function success(result){
            
            processLoadedLecture(result, soid);
             
            return result;
            
        }, function error(result){
            console.log(result);
            return result;
        });
    };
    
    var processLoadedLecture = function(result, soid){
        
        var lecture = popFromItemsArray(soid);
        if(lecture){
            //adaptMemberToStatusCount(lecture.Status, result.data.data.Status);
            
            lecture.Status = result.data.data.Status;
            lecture.Tests = result.data.data.Tests;
            
            lecture.Tests.sort(function(a, b){
                return a.AdmisteredOn - b.AdmisteredOn;
            });
            
            lecture.Tests.forEach(function(el){
                var v = el.AdmisteredOn.substr(6, 13);
                el.AdmisteredOn = new Date(Number(v)); 
            });
            
            addToItemsArray(lecture);
            
            addLectureToCertifications(lecture);
        }
    };
    
    var adaptMemberToStatusCount = function(oldStatus, newStatus){
        if(oldStatus != newStatus){
            var member = Session.member;
        
            switch(oldStatus){
                case "InQueue": member.CountInQueue--; break;
                case "Incomplete": member.CountIncomplete--; break;
                case "Completed": member.CountCompleted--; break;
                case "Archived": member.CountArchived--; break;
                case "Scheduled": member.CountScheduled--; break;
            }
            
            switch(newStatus){
                case "InQueue": member.CountInQueue++; break;
                case "Incomplete": member.CountIncomplete++; break;
                case "Completed": member.CountCompleted++; break;
                case "Archived": member.CountArchived++; break;
                case "Scheduled": member.CountScheduled++; break;
            }
            
            Session.addMemberObject(member);
        }
        
    };
    
    this.loadMemberObject = function(){
        
        if($state.current.name.includes("Succeed")) return null;
        
        return $http.post("/Api/GetMember", {memberSoid: Session.userId}).then(function(response){
            
            Session.addMemberObject(response.data.data);
            
            self.processMemberObject(response);
            
            return response;
            
        }, function error(response){
            return response;
        });
    };
    
    this.processMemberObject = function(response){
            
        Catalog.getCatalogPromise().then(
            function success(result){
        
                self.destroy();
                
                for(i = 0; i < Session.member.Certifications.length; i++)
                    self.items.certifications.push(Catalog.getLocalCertificationById(Session.member.Certifications[i]));
                    
                for(var i = 0; i < Session.member.Lectures.length; i++)
                    self.addLecture(Session.member.Lectures[i], result);
                
                if(Session.member.IsUnlimited && self.items.incomplete.length + self.items.inQueue.length + self.items.completed.length < result.data.data.Courses.length){
                    
                    var coursesToAdd = result.data.data.Courses.filter(function(el){
                        
                        var indexIncomplete = indexOfObject(self.items.incomplete, el.Soid);
                        var indexCompleted = indexOfObject(self.items.completed, el.Soid);
                        var indexInQueue = indexOfObject(self.items.inQueue, el.Soid);
                        
                        return indexIncomplete + indexCompleted + indexInQueue == -3;
                    });
                    
                    for(i = 0; i < coursesToAdd.length; i++){
                        var lecture = {
                            Status:  "InQueue",
                            Soid: null,
                            IsLecture: false,
                            CourseSoid: coursesToAdd[i].Soid,
                            CourseName: coursesToAdd[i].Name
                        };
                        
                        self.addLecture(lecture, result);
                    }
                }
                
                self.valid = true;
                
            }, function error(result){
                console.log(result);    
            });
    };
    
    var indexOfObject = function(arr, objSoid){
        var i = 0;

        while (i < arr.length && arr[i].CourseSoid != objSoid) i++;

        if (i == arr.length) i = -1;

        return i;
    };
    
    this.createLecture = function(lect){
        var compositeSoid = Session.userId + "-" + lect.CourseSoid;
        return $http.post("/Api/GetLecture", {lectureSoid: compositeSoid}).then(function success(result){
            self.items.inQueue = self.items.inQueue.filter(function(el){
                return el.CourseSoid != lect.CourseSoid;    
            });
            var lecture = result.data.data;
            lecture.CourseObject = lect.CourseObject;
            self.items.inQueue.push(lecture);
            return result;
        }, function error(result){
            console.log(result);
            return result;
        });  
    };
    
    this.addLecture = function(lecture, response){

        lecture.CourseObject = response.data.data.Courses.filter(function(el){
            return el.Soid == lecture.CourseSoid;
        });
        
        if(lecture.CourseObject.length == 1) 
            lecture.CourseObject = lecture.CourseObject[0];
        else 
            lecture.CourseObject = null;
        
        switch(lecture.Status){
            case "InQueue": self.items.inQueue.push(lecture); self.items.inQueue.sort(courseComparator); break;
            case "Completed": self.items.completed.push(lecture); self.items.completed.sort(courseComparator); break;
            case "Incomplete": self.items.incomplete.push(lecture); self.items.incomplete.sort(courseComparator); break;
            case "Archived": self.items.archived.push(lecture); self.items.archived.sort(courseComparator); break;
            case "Scheduled": self.items.scheduled.push(lecture); self.items.scheduled.sort(courseComparator); break;
        }
        
        if(lecture.Scheduled){
            self.items.scheduled.push(lecture);
            self.items.scheduled = self.items.scheduled.sort(courseComparator);
        } 
        
        addLectureToCertifications(lecture);
    };
    
    var courseComparator = function(a,b) {
        var tmpA = a.Name, tmpB = b.Name;
        if(!a.Name && a.CourseObject) 
            tmpA = a.CourseObject.Name;
        else
            tmpA = a.CourseName;
        if(!b.Name && b.CourseObject) 
            tmpB = b.CourseObject.Name;
        else
            tmpB = b.CourseName;
        if (tmpA < tmpB)
            return -1;
        if (tmpA > tmpB)
            return 1;
        return 0;
    };
    
    var popFromItemsArray = function(soid){
        
        var tmp = null;
        
        // incomplete
        tmp = self.items.incomplete.filter(function(el) {
            return el.Soid == soid;
        });
        
        if(tmp.length == 1){
            self.items.incomplete = self.items.incomplete.filter(function(el) {
                return el.Soid != soid; 
            });
            return tmp[0];
        }
        
        // completed
        tmp = self.items.completed.filter(function(el) {
            return el.Soid == soid;
        });
        
        if(tmp.length == 1){
            self.items.completed = self.items.completed.filter(function(el) {
                return el.Soid != soid; 
            });
            return tmp[0];
        }
        
        // inqueue
        tmp = self.items.inQueue.filter(function(el) {
            return el.Soid == soid;
        });
        
        if(tmp.length == 1){
            self.items.inQueue = self.items.inQueue.filter(function(el) {
                return el.Soid != soid; 
            });
            return tmp[0];
        }
        
        // scheduled
        tmp = self.items.scheduled.filter(function(el) {
            return el.Soid == soid;
        });
        
        if(tmp.length == 1){
            self.items.scheduled = self.items.scheduled.filter(function(el) {
                return el.Soid != soid; 
            });
            return tmp[0];
        }
        
        // archived
        tmp = self.items.archived.filter(function(el) {
            return el.Soid == soid;
        });
        
        if(tmp.length == 1){
            self.items.archived = self.items.archived.filter(function(el) {
                return el.Soid != soid; 
            });
            return tmp[0];
        }
        
        return null;
    };
    
    var addToItemsArray = function(lecture){
        switch(lecture.Status){
            case "InQueue": self.items.inQueue.push(lecture); break;
            case "Completed": self.items.completed.push(lecture); break;
            case "Incomplete": self.items.incomplete.push(lecture); break;
            case "Archived": self.items.archived.push(lecture); break;
            case "Scheduled":  self.items.scheduled.push(lecture); break;
        }
    };
    
    var addLectureToCertifications = function(lecture){
        for(var j = 0; j < self.items.certifications.length; j++){
            var found = false;
            var i = 0;
            while(i < self.items.certifications[j].Courses.length && !found){
                found = self.items.certifications[j].Courses[i].Soid == lecture.CourseSoid;
                i++;
            }
            
            if(found){
                self.items.certifications[j].Courses[i-1] = lecture;
            }
            
            self.items.certifications[j].Courses.sort(courseComparator);      
        }
    };
    
    this.getLectureSoid = function(courseSoid){
        var tmp = self.items.incomplete.filter(function(el){
            return el.CourseSoid == courseSoid;
        });  
        
        if(tmp.length == 1) return tmp[0].Soid;
            
        tmp = self.items.completed.filter(function(el){
            return el.CourseSoid == courseSoid;
        });  
        
        if(tmp.length == 1) return tmp[0].Soid;
            
        tmp = self.items.inQueue.filter(function(el){
            return el.CourseSoid == courseSoid;
        });  
        
        if(tmp.length == 1) return tmp[0].Soid;
            
        tmp = self.items.archived.filter(function(el){
            return el.CourseSoid == courseSoid;
        });  
        
        if(tmp.length == 1) return tmp[0].Soid;
            
        tmp = self.items.scheduled.filter(function(el){
            return el.CourseSoid == courseSoid;
        });  
        
        if(tmp.length == 1) return tmp[0].Soid;
        
        return null;
    };
    
    this.getDiploma = function(soid){
        return $http.post("/Api/GetDiploma", {lectureSoid: soid});
    };
    
    this.sortCourses = function(){
        self.items.archived.sort(courseComparator);
        self.items.completed.sort(courseComparator);
        self.items.incomplete.sort(courseComparator);
        self.items.inQueue.sort(courseComparator);
        self.items.scheduled.sort(courseComparator);
    };
    
    this.reloadMemberObject = function(){
        
        if($state.current.name.includes("Succeed")) return;
        
        self.reloadNeeded = false;
        
        $http.post("/Api/SetMemberCleanup", {memberSoid: Session.userId}).then(function success(){
            self.loadMemberObject();
        });

    };
    
    this.isWatch = function(soid){
        
        var incomplete = self.items.incomplete.filter(function(el){
            return el.CourseSoid == soid;
        });
        
        var completed = self.items.completed.filter(function(el){
            return el.CourseSoid == soid;
        });
        
        var inqueue = self.items.inQueue.filter(function(el){
            return el.CourseSoid == soid;
        });
        
        return incomplete.length == 1 || completed.length == 1 || inqueue.length == 1;
    };
    
    this.isPrint = function(soid){
        var completed = self.items.completed.filter(function(el){
            return el.CourseSoid == soid;
        });
        
        return completed.length == 1;
    };
    
    this.isTest = function(soid){
        var incomplete = self.items.incomplete.filter(function(el){
            return el.CourseSoid == soid && el.Viewed;
        });
        
        return incomplete.length == 1;
    };
    
    this.watch = function(soid){
        
        if(!soid) return;
        
        $http.post("/Api/SetWatch", {lectureSoid: soid}).then(function success(result){
            processLoadedLecture(result, soid);
            $http.post("/Api/SetMemberCleanup", {memberSoid: Session.userId});
            $state.go("player", {lectureName: result.data.data.CourseName.replaceAll(" ", "-"), lectureSoid: soid});
        });
    };
    
    this.test = function(soid){
        if(!soid) return;
        
        if($state.current.name.includes("Succeed")){
            self.loadLectureBySoid(soid).then(function success(result){
                $state.go("testSucceed", {lectureName: result.data.data.CourseName, lectureSoid: soid});
            }, function error(result){
                console.log(result);
                $state.go("homeSucceed");
            });
        }else{
            $localStorage.lectureSoidToReload = soid;
            var tmp = self.items.incomplete.filter(function(el) { return el.Soid == soid;});
            var lectureName = "Lecture";
            
            if(tmp.length == 1) lectureName = tmp[0].CourseName.replaceAll(" ", "-");   
            
            $state.go("test", {lectureName: lectureName, lectureSoid: soid});
        }
    };
    
    this.print = function(soid){
        
        if(!soid) return;
        $state.go("accountDiploma", {lectureSoid: soid});
    };
    
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };
    
}]);