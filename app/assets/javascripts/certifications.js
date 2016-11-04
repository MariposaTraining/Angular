$(function(){
    $(".hidden-list-container > button").click(function(){
        $(this).parent().find('.hidden-list').toggle();
        $(this).find("i").each(function(){ $(this).toggle(); });
    });
});