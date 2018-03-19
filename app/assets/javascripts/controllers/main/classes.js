/* global angular */

angular.module('mariposa-training')
  .controller('ClassesCtrl', ['$scope', '$state', 'Catalog', 'Account', '$http', function($scope, $state, Catalog, Account, $http){
      
    $scope.init = function(){
        $scope.currentPage = 1;
        $scope.numPerPage = 5;
        $scope.catalogClasses = [];
        $scope.filteredClasses = [];
        $scope.maxSize = 1000;
        $scope.filterText = "";
        $scope.Account = Account;
    
        if(Catalog.data != null && Catalog.data.Classes != null){
            $scope.catalogClasses = Catalog.data.Classes;
            $scope.filteredClasses = Catalog.data.Classes;
            $scope.displayedClasses = Catalog.data.Classes;
            $scope.pagesNumber = Math.ceil($scope.displayedClasses.length / $scope.numPerPage);
            
            $scope.approvals = Catalog.data.Approvals;
            $scope.topics = Catalog.data.Topics;
            $scope.disciplines = Catalog.data.Disciplines;
            if($state.params["selectedFilter"] != null && $state.params["selectedFilter"]["Soid"] != "")
                $scope.filterCoursesByApproval($state.params["selectedFilter"]);
                
        }else
            Catalog.getClasses().then(function(res){
                $scope.catalogClasses = res;
                $scope.filteredClasses = res;
                $scope.displayedClasses = res;
                $scope.pagesNumber = Math.ceil($scope.displayedClasses.length / $scope.numPerPage);
            
                $scope.approvals = Catalog.data.Approvals;
                $scope.topics = Catalog.data.Topics;
                $scope.disciplines = Catalog.data.Disciplines;
                
                if($state.params["selectedFilter"] != null && $state.params["selectedFilter"]["Soid"] != "")
                    $scope.filterCoursesByApproval($state.params["selectedFilter"]);
                    
            });
    };
   
    $scope.learnMore = function(c){
        $state.go('classDescription', {Soid:c.Soid});
    };
    
    $scope.playLecture = function(c){
        $scope.Account.play($scope.Account.getLectureSoid(c.Soid));
    };
    
    $scope.test = function(c){
        $scope.Account.test($scope.Account.getLectureSoid(c.Soid));  
    };
    
    $scope.print = function(c){
        $scope.Account.print($scope.Account.getLectureSoid(c.Soid));
    };
   
/*    $scope.updatePage = function(i){
        var tmp = $scope.currentPage + i;
        if(tmp != 0 && tmp <= $scope.pagesNumber)
            $scope.currentPage = tmp;
    };*/
   
    $scope.filterCourses = function(){
        $scope.filteredClasses = $scope.catalogClasses.filter(function(item){
            return item.Name.toLowerCase().indexOf($scope.filterText.toLowerCase()) != -1;
        });
        $scope.displayedClasses = $scope.filteredClasses;
    //    $scope.pagesNumber = Math.ceil($scope.displayedClasses.length / $scope.numPerPage);
    //    $scope.currentPage = 1;
        
        $scope.filterType = "";
        $scope.filterName = "";
    };
    
    $scope.filterCoursesByApproval = function(el){
        $scope.displayedClasses = $scope.catalogClasses.filter(function(item){
            return item.ApprovalSoids.indexOf(el.Soid) != -1;
        });
    //    $scope.pagesNumber = Math.ceil($scope.displayedClasses.length / $scope.numPerPage);
        $scope.filterType = "CEUs";
        $scope.filterName = el.ApprovalBody;
    //    $scope.currentPage = 1;
    };
    
    $scope.filterCoursesByTopic = function(el){
        $scope.displayedClasses = $scope.catalogClasses.filter(function(item){
            return item.TopicSoids.indexOf(el.Soid) != -1;
        });
   //     $scope.pagesNumber = Math.ceil($scope.displayedClasses.length / $scope.numPerPage);
        $scope.filterType = "Topic";
        $scope.filterName = el.Name;
    //    $scope.currentPage = 1;
    };
    
    $scope.filterCoursesByDiscipline = function(el){
        $scope.displayedClasses = $scope.catalogClasses.filter(function(item){
            return item.DisciplineSoids.indexOf(el.Soid) != -1;
        });
    //    $scope.pagesNumber = Math.ceil($scope.displayedClasses.length / $scope.numPerPage);
        $scope.filterType = "Discipline";
        $scope.filterName = el.Name;
    //    $scope.currentPage = 1;
    };
    
    $scope.init();
    
}]);