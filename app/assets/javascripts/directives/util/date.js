/* global angular */

angular.module("mariposa-training")
    .directive("utilDate", [function(){
        
        function link(scope, element, attrs){
            
            var resetDate = function(){
                scope.date = {
                    day: null,
                    month: null,
                    year: null
                };
            };
            
            var aboveMinDate = function(){
                var res = true;
                if(scope.min){
                    if(scope.date.year < scope.min.getFullYear()) res = false;
                    if(scope.date.year == scope.min.getFullYear() && scope.date.month < scope.min.getMonth()) res = false;
                    if(scope.date.year == scope.min.getFullYear() && scope.date.month == scope.min.getMonth() && scope.date.day < scope.min.getDate()) res = false;
                }
                return res;
            };
            
            scope.update = function(){
                
                if(scope.date.day && scope.date.month && scope.date.year)
                    if(!(scope.date.day == 31 && scope.months31.indexOf(scope.date.month) == -1) &&
                        !(scope.date.day == 30 && scope.monthsOther.indexOf(scope.date.month) != -1) &&
                        !(scope.date.day == 29 && scope.monthsOther.indexOf(scope.date.month) != -1 && scope.date.year % 4 != 0) &&
                        aboveMinDate()){
        
                        if(scope.ngModel == null)
                            scope.ngModel = new Date();
                            
                        scope.ngModel.setFullYear(scope.date.year);
                        scope.ngModel.setMonth(scope.date.month-1);
                        scope.ngModel.setDate(scope.date.day);
                    }else{
                        scope.ngModel = null;
                    }
            }
            
            scope.$watch('ngModel', function(){
                initDate();
            }, true);
            
            var initDate = function(){
                if(scope.ngModel != null && scope.ngModel instanceof Date && scope.ngModel.getFullYear() > 2000){
                    scope.date.day = scope.ngModel.getDate();
                    scope.date.month = scope.ngModel.getMonth()+1;
                    scope.date.year = scope.ngModel.getFullYear();
                }else if(scope.ngModel == null){
                    resetDate();
                }
            };
            
            var init = function(){
                
                scope.months31 = [1, 3, 5, 7, 8, 10, 12];
                scope.months30 = [4, 6, 9, 11];
                scope.monthsOther = [2];
                
                scope.months = [
                    {name: 'January', value: 1},
                    {name: 'February', value: 2},
                    {name: 'March', value: 3},
                    {name: 'April', value: 4},
                    {name: 'May', value: 5},
                    {name: 'June', value: 6},
                    {name: 'July', value: 7},
                    {name: 'August', value: 8},
                    {name: 'September', value: 9},
                    {name: 'October', value: 10},
                    {name: 'November', value: 11},
                    {name: 'December', value: 12}
                ];
                
                scope.years = [];
                for(var i = 2016; i < 2030; i++)
                    if((scope.min && scope.min.getFullYear() <= i) || !scope.min)
                        scope.years.push(i);
                    
                scope.days = [];
                for(var i = 1; i < 32; i++)
                    scope.days.push(i);
                
                resetDate();
            
                initDate();
            }
            
            init();
            
        }
        
        return{
            scope: {
                ngModel: '=ngModel',
                min: '=min'
            },
            restrict: 'E',
            templateUrl: "directive/util/utilDate.html",
            link: link
        };
    }]);
