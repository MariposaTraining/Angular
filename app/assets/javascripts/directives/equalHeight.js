/* global angular */

angular.module('mariposa-training').directive('equalHeight', function () {
    function link(scope, element, attrs) { 
        
        var adaptHeight = function(){
            var maxHeight = 0;
            
            $(element).children().each(function(){
                if($(this).innerHeight() > maxHeight) maxHeight = $(this).innerHeight();
            });
            
            $(element).children().each(function(){
                
            });  
              
        };
        
        $(window).resize(adaptHeight);
        adaptHeight();
    }
    return {
        restrict: 'A', 
        link: link 
    };
}); 