$(function(){
    
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    var checkLogin = function(){
        if($("#emailTxt").val().trim() == "" || !$("#emailTxt").val().trim().match(re) || $("#passwordTxt").val().trim() == "")
            $("#loginBtn").addClass("disabled");
        else
            $("#loginBtn").removeClass("disabled");
    };
    
    var checkSignUp = function(){
        if($("#emailNewTxt").val().trim() != "" && $("#emailNewTxt").val().trim().match(re) && 
            $("#firstNameTxt").val().trim() != "" && $("#lastNameTxt").val().trim() != "" &&
            $("#passwordNewTxt").val().trim() != "" && $("#passwordNewConfTxt").val().trim() != "" &&
            $("#passwordNewTxt").val().trim().localeCompare($("#passwordNewConfTxt").val().trim()) == 0)
                
            $("#signUpBtn").removeClass("disabled");
        else
            $("#signUpBtn").addClass("disabled");
    }
    
    var adaptBodyPadding = function(){
        $("body").css("padding-bottom", $("footer").height()+10);  
        $("body").css("padding-top", $(".navbar-fixed-top").height() + 20); 
    };
    
    var clearInputsInModal = function(){
        $(".modal").find("input").each(function(){
            $(this).val("");
        });    
    };
    
    var setSameChildrenHeight = function(){
        var $children = $('.row.same-children-height > div > *');
        var maxHeight = 0;
        $children.each(function () {
            maxHeight = Math.max($(this).height(), maxHeight);
        });
        $children.height(maxHeight);
    }
    
    adaptBodyPadding();
    setSameChildrenHeight();
    
    var resize = function(){
        adaptBodyPadding();
        setSameChildrenHeight();
    };
    
//    $(window).resize(adaptBodyPadding);
//    $(window).resize(setSameChildrenHeight);
  
    $(window).resize(resize);
    
    $('.modal').on('hidden.bs.modal', clearInputsInModal);
    
    $("#emailTxt").keyup(checkLogin);
    $("#passwordTxt").keyup(checkLogin);
    
    $("#firstNameTxt").keyup(checkSignUp);
    $("#lastNameTxt").keyup(checkSignUp);
    $("#passwordNewTxt").keyup(checkSignUp);
    $("#passwordNewConfTxt").keyup(checkSignUp);
    $("#emailNewTxt").keyup(checkSignUp);
});