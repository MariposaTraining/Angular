$(function(){
    
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    var checkFreeClass = function(){
        if($("#freeClassEmailTxt").val().trim() == "" || !$("#freeClassEmailTxt").val().trim().match(re) || 
            $("#freeClassFirstNameTxt").val().trim() == "" || $("#freeClassLastNameTxt").val().trim() == "" ||
            $("#freeClassPasswordNewTxt").val().trim() == "" || $("#freeClassPasswordNewConfTxt").val().trim() == "" ||
            $("#freeClassPasswordNewTxt").val().trim().localeCompare($("#freeClassPasswordNewConfTxt").val().trim()) != 0)
            
            $("#getStartedBtn").addClass("disabled");
        else
            $("#getStartedBtn").removeClass("disabled");
    };
    
    var checkSubscribe = function(){
        if($("#subscribeEmailTxt").val().trim() != "" && $("#subscribeEmailTxt").val().trim().match(re) && 
            $("#subscribeFirstNameTxt").val().trim() != "" && $("#subscribeLastNameTxt").val().trim() != "")
                
            $("#submitInfoBtn").removeClass("disabled");
        else
            $("#submitInfoBtn").addClass("disabled");
            
    }
    
    var width = $(window).width();
    
    var adjustWindowContent = function(){
        if($("body").width() <= 1180){
            var events = $("#events").detach();
            var freeClassWell = $("#freeClassWell").detach();
            var subscriptionWell = $("#subscriptionWell").detach();
            $("#eventsContainerSmaller").append(events);
            $("#subscribtionContainerSmaller").append(freeClassWell);
            $("#subscribtionContainerSmaller").append(subscriptionWell);
        }else{
            var events = $("#events").detach();
            var freeClassWell = $("#freeClassWell").detach();
            var subscriptionWell = $("#subscriptionWell").detach();
            $("#eventsContainerLg").append(events);
            $("#subscribtionContainerLg").append(freeClassWell);
            $("#subscribtionContainerLg").append(subscriptionWell);
        }
        width = $("body").width();
    }
    
    
    
    adjustWindowContent();
    
    $(window).resize(adjustWindowContent);
    
/*    $("#subscribeEmailTxt").keyup(checkSubscribe);
    $("#subscribeFirstNameTxt").keyup(checkSubscribe);
    $("#subscribeLastNameTxt").keyup(checkSubscribe);
    
    $("#freeClassEmailTxt").keyup(checkFreeClass);
    $("#freeClassFirstNameTxt").keyup(checkFreeClass);
    $("#freeClassLastNameTxt").keyup(checkFreeClass);
    $("#freeClassPasswordNewTxt").keyup(checkFreeClass);
    $("#freeClassPasswordNewConfTxt").keyup(checkFreeClass); */
});