/* global angular */

angular.module('mariposa-training')
  .controller('ClassDescriptionCtrl', ['$scope', '$state', '$stateParams', 'Catalog', 'Cart', 'ITEM_TYPES', '$sce', 'Account',
    function($scope, $state, $stateParams, Catalog, Cart, ITEM_TYPES, $sce, Account){
   
    $scope.init = function(){
        $scope.suggestions = [];
        $scope.Account = Account; 
        
        Catalog.getCourseById($stateParams.Soid).then(function(result){
            $scope.course = result;
            for(var i = 0; i < result.Approvals.length; i++)
                $scope.course.Approvals[i].CustomDescription = $scope.course.Approvals[i].ApprovalType.BodyDescription.replaceAll("{0}", "{" + $scope.course.Approvals[i].CeuApprovalNumber + "}");
            $scope.course.Description = $sce.trustAsHtml($scope.course.Description.replaceAll("[[", "<").replaceAll("]]", ">"));
        
            $scope.fillSuggestions();
        });
    };
    
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };
    
    $scope.fillSuggestions = function(){
        if(Catalog.data != null && Catalog.data.Classes != null){
            $scope.courses = Catalog.data.Classes;
            $scope.getSuggestions();
        }else{
            Catalog.getClasses().then(function(res){
                $scope.courses = res;
                $scope.getSuggestions();
            });
        }
    };
    
    $scope.getSuggestions = function(){
        
        if($scope.courses.length > 5)
            while($scope.suggestions.length < 5){
                var r = parseInt(Math.random() * $scope.courses.length);
                if(!contains($scope.suggestions, $scope.courses[r]) && $scope.course.Soid != $scope.courses[r].Soid)
                    $scope.suggestions.push($scope.courses[r]);
            }
        else
            $scope.suggestions = $scope.courses.filter(function(el){
                if(el.Soid == $scope.course.Soid) return false;
                else return true;
            });
    };
    
    $scope.buy = function(){
        Cart.addItem(ITEM_TYPES.course, $scope.course);
        $state.go('classes');
    };
    
    $scope.learnMore = function(s){
       $state.go('classDescription', {Soid:s.Soid});
    };
    
    var contains = function(arr, el){
        for(var i = 0; i < arr.length; i++)
            if(arr[i] == el)
                return true;
        return false;
    };
    
    $scope.watch = function(c){
        $scope.Account.watch($scope.Account.getLectureSoid(c.Soid));
    };
    
    $scope.print = function(c){
        $scope.Account.print($scope.Account.getLectureSoid(c.Soid));
    };
    
    $scope.test = function(c){
        $scope.Account.test($scope.Account.getLectureSoid(c.Soid));
    };
    
    $scope.init();
   
}]);