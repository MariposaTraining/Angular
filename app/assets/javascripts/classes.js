$(function() {
    
    /**
     * on keyup in the filterTxt field,
     * a search for the filterTxt field value is performed 
     * among the elements of the searchlist
     */
    $("#filterTxt").keyup(function() {
        var value = $(this).val().trim().toLowerCase();
        $("#searchlist .list-group-item").each(function() {
            if (!$(this).find("h4").text().toLowerCase().includes(value))
                $(this).hide();
            else
                $(this).show();
        });
    });
    
    var adjustPromoHeight = function(){
        $("#promoSm").height($("#promoLg").height());
    };
    
    adjustPromoHeight();
    
    $(window).resize(adjustPromoHeight);
    
    $("#filterLinks li").click(function(){
        var filterVal = $(this).text();
        
        $("#filteredBy").text($(this).parent().attr("name") + " - " + filterVal);
        
        $("#searchlist .list-group-item").each(function() {
            if($(this).find("input").val().includes(filterVal))
                $(this).show();
            else
                $(this).hide();
        });
    });
});