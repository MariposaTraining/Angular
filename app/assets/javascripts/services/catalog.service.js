/* global angular */

angular.module('mariposa-training').service('Catalog', ['$http', 'Session', 'ITEM_TYPES', function ($http, Session, ITEM_TYPES) {
    
    this.data = {
        Classes: null,
        Certifications: null,
        Bundles: null,
        Approvals: null,
        Topics: null,
        Disciplines: null
    };
    
    var self = this;
    
    this.getCatalogPromise = function(){
        return $http
        .post('/Api/getCatalog')
        .then(function success(result){
            processData(result);
            return result;
        }, function error(result){
            console.log(result);
            return null;
        });
    };
    
    this.getClasses = function(){
        if(self.data == null || !self.data.hasOwnProperty('Classes') || self.data.Classes == null)
            return self.getData(0);
        else    
            return self.data.Classes;
    };
    
    this.getCertifications = function(){
        if(this.data == null || !this.data.hasOwnProperty('Certifications') || this.data.Certifications == null)
            return this.getData(1);
        else    
            return this.data.Certifications;
    };
    
    this.getBundles = function(){
        if(this.data == null || !this.data.hasOwnProperty('Bundles') || this.data.Bundles == null)
            return this.getData(2);
        else    
            return this.data.Bundles;  
    };
    
    this.getApprovals = function(){
       if(this.data == null || this.data.Approvals == null)
            return this.getData(3);
        else    
            return this.data.Approvals; 
    };
    
    this.getTopics = function(){
       if(this.data == null || this.data.Topics == null)
            return this.getData(4);
        else    
            return this.data.Topics; 
    };
    
    this.getDisciplines = function(){
       if(this.data == null || this.data.Disciplines == null)
            return this.getData(5);
        else    
            return this.data.Disciplines; 
    };
    
    this.getCourseById = function(soid){
        return $http
                .post('/Api/getCourse', {courseSoid: soid})
                .then(function(result){
                    console.log(result.data);
                    if(result.data.ok == true)
                        result.data = result.data.data;
                    var tmp = result.data.SqlId;
                    if(tmp < 10) tmp = "0" + tmp;

                    result.data.imageSrc = "http://ec2-54-67-60-169.us-west-1.compute.amazonaws.com:8000/Content/Pictures/Classes/"  + tmp + ".jpg";
                    result.data.thumbSrc = "http://ec2-54-67-60-169.us-west-1.compute.amazonaws.com:8000/Content/Pictures/Classes/Thumbs/"  + tmp + ".jpg";
                    return result.data;
                });
    };
    
    this.getLocalCertificationById = function(soid){
        var certs = self.getCertifications();
        if(certs != null)
            return certs.filter(function(el){
                return el.Soid == soid;
            })[0];
        else
            return null;
    };
    
    this.getData = function(resultType){
        
        return $http
        .post('/Api/getCatalog')
        .then(function(result){
            processData(result);
            return pickReturnValue(resultType);
        });
    };
    
    var extractCoursesData = function(coursesList, courseSoids){
        var courses = [];
        for(var j = 0; j < courseSoids.length; j++){
            courses[j] = coursesList.filter(function(el){
                return el.Soid == courseSoids[j];
            })[0];
        }
        return courses;
    };
    
    var pickReturnValue = function(resultType){
        if(resultType == 0)
            return self.data.Classes;
        else if(resultType == 1)
            return self.data.Certifications;
        else if(resultType == 2)
            return self.data.Bundles;
        else if(resultType == 3)
            return self.data.Approvals;
        else if(resultType == 4)
            return self.data.Topics;
        else
            return self.data.Disciplines;
    };
    
    var courseComparator = function(a,b) {
        var tmpA = a.Name, tmpB = b.Name;
        if(!a.Name) tmpA = a.CourseObject.Name;
        if(!b.Name) tmpB = b.CourseObject.Name;
        if (tmpA < tmpB)
            return -1;
        if (tmpA > tmpB)
            return 1;
        return 0;
    };
    
    var processData = function(result){
        if(result.data.hasOwnProperty('data'))
                result = result.data;
            
            // get classes
            self.data.Classes = result.data.Courses;
            for(var i = 0; i < result.data.Courses.length; i++){
                var tmp = self.data.Classes[i].SqlId;
                if(tmp < 10)
                    tmp = "0" + tmp;
                self.data.Classes[i].imageSrc = "http://ec2-54-67-60-169.us-west-1.compute.amazonaws.com:8000/Content/Pictures/Classes/"  + tmp + ".jpg";
                self.data.Classes[i].thumbSrc = "http://ec2-54-67-60-169.us-west-1.compute.amazonaws.com:8000/Content/Pictures/Classes/Thumbs/" + tmp + ".jpg";
            }
            
            self.data.Classes.sort(courseComparator);
            
            // get certifications
            self.data.Certifications = [];
            for(var i = 0; i < result.data.Certifications.length; i++){
                self.data.Certifications[i] = {};
                self.data.Certifications[i].Soid = result.data.Certifications[i].Soid;
                self.data.Certifications[i].Name = result.data.Certifications[i].Name;
                self.data.Certifications[i].Price = result.data.Certifications[i].Price;
                self.data.Certifications[i].PriceNoClass = result.data.Certifications[i].PriceNoClass;
                self.data.Certifications[i].Description = result.data.Certifications[i].Description;
                self.data.Certifications[i].Courses = extractCoursesData(result.data.Courses, result.data.Certifications[i].CourseSoids);
                self.data.Certifications[i].Courses.sort(courseComparator);
            }   
            
            // get bundles
            self.data.Bundles = [];
            for(i = 0; i < result.data.Packages.length; i++){
                self.data.Bundles[i] = {};
                self.data.Bundles[i].Soid = result.data.Packages[i].Soid;
                self.data.Bundles[i].Name = result.data.Packages[i].Name;
                self.data.Bundles[i].Price = result.data.Packages[i].Price;
                self.data.Bundles[i].Description = result.data.Packages[i].Description;
                self.data.Bundles[i].Courses = extractCoursesData(result.data.Courses, result.data.Packages[i].CourseSoids);
                self.data.Bundles[i].Courses.sort(courseComparator);
            }
            
            // get approvals
            self.data.Approvals = [];
            for(i = 0; i < result.data.Approvals.length; i++){
                self.data.Approvals[i] = {};
                self.data.Approvals[i].Soid = result.data.Approvals[i].Soid;
                self.data.Approvals[i].Accreditation = result.data.Approvals[i].Accreditation;
                self.data.Approvals[i].ApprovalBody = result.data.Approvals[i].ApprovalBody;
                self.data.Approvals[i].BodyDescription = result.data.Approvals[i].BodyDescription;
            }
            
            // get topics
            self.data.Topics = [];
            for(i = 0; i < result.data.Topics.length; i++){
                self.data.Topics[i] = {};
                self.data.Topics[i].Soid = result.data.Topics[i].Soid;
                self.data.Topics[i].Name = result.data.Topics[i].Name;
            }
            
            // get disciplines
            self.data.Disciplines = [];
            for(i = 0; i < result.data.Disciplines.length; i++){
                self.data.Disciplines[i] = {};
                self.data.Disciplines[i].Soid = result.data.Disciplines[i].Soid;
                self.data.Disciplines[i].Name = result.data.Disciplines[i].Name;
            }
    };
}]);