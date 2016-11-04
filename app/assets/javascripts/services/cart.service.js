/* global angular */

angular.module('mariposa-training').service('Cart', ['$http', '$q', 'Session', 'ITEM_TYPES', 'Catalog', '$sessionStorage',
    function($http, $q, Session, ITEM_TYPES, Catalog, $sessionStorage) {

        this.items = {
            courses: [],
            bundles: [],
            certifications: []
        };

        var self = this;
        this.localItemsCount = 0;
        this.totalPrice = 0;
    
        this.getTotalPrice = function() {
            if(Session.userId == null){
                var price = 0;
                self.items.courses.forEach(function(el) {
                    price += el.Price;
                });
                self.items.certifications.forEach(function(el) {
                    price += el.Price;
                });
                self.items.bundles.forEach(function(el) {
                    price += el.Price;
                });
                
                return price;
            }else
                return self.totalPrice;
        };
        
        this.getTotalCount = function() {
            return self.items.courses.length + self.items.certifications.length + self.items.bundles.length;
        };
        
        this.getCart = function(){
            if(Session.userId != null){
                if(self.localItemsCount != 0){
                    
                    self.localItemsCount = 0;
                    
                    var promises = [];
                    var url, data;
                    
                    for(var i = 0; i < self.items.courses.length; i++){
                        url = prepareURL(ITEM_TYPES.course, 1);
                        data = prepareData(ITEM_TYPES.course, self.items.courses[i], 1);
                        promises.push($http.post(url, data));
                    }
                    
                    for(i = 0; i < self.items.certifications.length; i++){
                        url = prepareURL(ITEM_TYPES.certification, 1);
                        data = prepareData(ITEM_TYPES.certification, self.items.certifications[i], 1);
                        promises.push($http.post(url, data));
                    }
                    
                    for(i = 0; i < self.items.bundles.length; i++){
                        url = prepareURL(ITEM_TYPES.bundle, 1);
                        data = prepareData(ITEM_TYPES.bundle, self.items.bundles[i], 1);
                        promises.push($http.post(url, data));
                    }
                    
                    console.log(promises);
                    
                    $q.all(promises).then(function(){
                        $sessionStorage.cartItems = null;
                        $http.post("/Api/getCart", {memberSoid: Session.userId}).then(fillCart, callbackError);    
                    });
                    
                }else{
                    $http.post("/Api/getCart", {memberSoid: Session.userId}).then(fillCart, callbackError);
                }
            }else{
                if($sessionStorage.cartItems)
                    self.items = $sessionStorage.cartItems;
            }
        };
        
        this.addItem = function(itemType, item){
            if(Session.userId != null){
                
               var data = prepareData(itemType, item, 1); 
               var url = prepareURL(itemType, 1);
               $http.post(url, data).then(fillCart, callbackError);
               
            }else{
                
                var object = adaptItemObject(itemType, item);
                
                var tmpArray;
                
                switch(itemType){
                    case ITEM_TYPES.course: tmpArray = self.items.courses; break;
                    case ITEM_TYPES.certification: tmpArray = self.items.certifications; break;
                    case ITEM_TYPES.bundle: tmpArray = self.items.bundles; break;
                } 
                
                if(indexOfObject(tmpArray, object.ItemSoid) == -1) 
                    tmpArray.push(object); 
                    
                $sessionStorage.cartItems = self.items;
                    
                self.localItemsCount++;
            }
        };
        
        this.removeItem = function(itemType, item){
            if(Session.userId != null){
                
                var data = prepareData(itemType, item, -1); 
                var url = prepareURL(itemType, -1);
                $http.post(url, data).then(fillCart, callbackError); 
                
            }else{
                var tmpArray;
                
                switch(itemType){
                    case ITEM_TYPES.course: tmpArray = self.items.courses; break;
                    case ITEM_TYPES.certification: tmpArray = self.items.certifications; break;
                    case ITEM_TYPES.bundle: tmpArray = self.items.bundles; break;
                } 
                
                tmpArray = tmpArray.filter(function(el){
                    if(el.ItemSoid == item.ItemSoid)
                        self.localItemsCount--;
                    return el.ItemSoid != item.ItemSoid;
                });  
                
                switch(itemType){
                    case ITEM_TYPES.course: self.items.courses = tmpArray; break;
                    case ITEM_TYPES.certification: self.items.certifications = tmpArray; break;
                    case ITEM_TYPES.bundle: self.items.bundles = tmpArray; break;
                } 
                
                $sessionStorage.cartItems = self.items;
            }
        };
        
        var indexOfObject = function(arr, objSoid){
            var i = 0;

            while (i < arr.length && arr[i].ItemSoid != objSoid) i++;

            if (i == arr.length) i = -1;

            return i;
        };
        
        var prepareData = function(itemType, item, action){
            var data = {
                memberSoid: Session.userId
            };
            
            if(action == 1){
                switch(itemType){
                    case ITEM_TYPES.course: data.courseSoid = item.ItemSoid ? item.ItemSoid : item.Soid; break;
                    case ITEM_TYPES.certification: data.certificationSoid = item.ItemSoid ? item.ItemSoid : item.Soid; break;
                    case ITEM_TYPES.bundle: data.packageSoid = item.ItemSoid ? item.ItemSoid : item.Soid; break;
                } 
            }else if(action == -1){
                data.itemSoid = item.ItemSoid;
            }
            
            return data;
        };
        
        var prepareURL = function(itemType, action){
            
            var url = "";
            
            if(action == 1){
                switch(itemType){
                    case ITEM_TYPES.course: url = "/Api/GetAddCourse"; break;
                    case ITEM_TYPES.certification: url = "/Api/GetAddCertification"; break;
                    case ITEM_TYPES.bundle: url = "/Api/GetAddPackage"; break;
                }
            }else if(action == -1){
                url = "/Api/GetRemoveItem";
            }
            
            return url;
        };
        
        var callbackError = function(response){
            console.log(response);
        }
        
        var adaptItemObject = function(itemType, item){
            var obj = {
                ItemSoid: item.Soid,
                Description: item.Name
            };
            
            switch(itemType){
                case ITEM_TYPES.course: 
                    obj.Price = item.PriceStudent;
                    obj.ItemType = "Course"; 
                    obj.thumbSrc = item.thumbSrc;
                    break;
                case ITEM_TYPES.certification: 
                    obj.Price = item.Price;
                    obj.ItemType = "Certification";
                    break;
                case ITEM_TYPES.bundle: 
                    obj.Price = item.Price;
                    obj.ItemType = "Package";
                    break;
            }
            
            return obj;
        }
        
        var fillCart = function(response) {
            
            console.log(response);
            
            if(response.data.hasOwnProperty('data'))
                response = response.data;

            self.items.courses = [];
            self.items.certifications = [];
            self.items.bundles = [];

            var courseCount = 0;
            var certCount = 0;
            var bundleCount = 0;

            for (var i = 0; i < response.data.Items.length; i++) {

                if (response.data.Items[i].ItemType == "Course"){
                    self.items.courses[courseCount] = response.data.Items[i];
                    var tmp = response.data.Items[i].ItemSqlId;
                    if(tmp < 10) tmp = "0" + tmp;
                    self.items.courses[courseCount].thumbSrc = "http://www.mariposatraining.com/Content/Pictures/Classes/Thumbs/" + tmp + ".jpg";
                    courseCount++;
                }else if (response.data.Items[i].ItemType == "Certification")
                    self.items.certifications[certCount++] = response.data.Items[i];
                else
                    self.items.bundles[bundleCount++] = response.data.Items[i];
            }
            
            self.totalPrice = response.data.Total;
        };
        
        this.removeAllItems = function(){
            self.items.courses = [];
            self.items.bundles = [];
            self.items.certifications = [];
        };
    }
]);