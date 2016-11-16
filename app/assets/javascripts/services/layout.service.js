/* global angular $ */

angular.module('mariposa-training').service('Layout', ['$rootScope', '$state', '$window', function($rootScope, $state, $window) { 
  
  var self = this;
  
  function unbindResizeListeners() { $(window).off('resize'); }
  
  function playerResize() {
    var height = $('#player').height() - $('#footer').height() - $('#header').height();
    if(height > 0)
      $('#slide').css('height', height + 'px');
  }
  
  function testResize() {
    var height = $('body').height() - $('#footer').height() - $('#header').height();
    if(height > 0)
      $('#quiz').css('height', height + 'px');
  }
  
  function adaptBodyPadding() {
    $("body").css("padding-bottom", $("footer").height() + 20);
    $("body").css("padding-top", $(".navbar-fixed-top").height() + 20);
  }

  function setSameChildrenHeight() {
    var children = $('.row.same-children-height > div > *');
    var maxHeight = 0;
    children.each(function() {
      maxHeight = Math.max($(this).height(), maxHeight);
    });
    children.height(maxHeight);
  }

  function adjustWindowContent() {
    var events = null;
    var freeClassWell = null;
    var subscriptionWell = null;
    if ($("body").width() <= 1180) {
      events = $("#events").detach();
      freeClassWell = $("#freeClassWell").detach();
      subscriptionWell = $("#subscriptionWell").detach();
      $("#eventsContainerSmaller").append(events);
      $("#subscribtionContainerSmaller").append(freeClassWell);
      $("#subscribtionContainerSmaller").append(subscriptionWell);
    }
    else {
      events = $("#events").detach();
      freeClassWell = $("#freeClassWell").detach();
      subscriptionWell = $("#subscriptionWell").detach();
      $("#eventsContainerLg").append(events);
      $("#subscribtionContainerLg").append(freeClassWell);
      $("#subscribtionContainerLg").append(subscriptionWell);
    }
  }
  
  function defaultResize() {
    adaptBodyPadding();
    adjustWindowContent();
    setSameChildrenHeight();
  }
  
  function setupPlayerLayout() {
    $('body').css('padding', '0');
    setTimeout(playerResize, 1000);
    $(window).on('resize', playerResize);    
  }
  
  function setupTestLayout() {
    $('body').css('padding', '0');
    setTimeout(testResize, 1000);
    $(window).on('resize', testResize);
  }
  
  function setupDefaultLayout() {
    setTimeout(defaultResize, 1000);
    $(window).on('resize', defaultResize);
  }
  
  function setupLayout() {
    unbindResizeListeners();
    switch($state.current.name){
      case "playerSucceed":
      case "player": setupPlayerLayout(); break;
      case "testSucceed":
      case "test": setupTestLayout(); break;
      default: setupDefaultLayout(); break;
    }
  }
  
  this.init = function () {
    setupLayout();
    $rootScope.$on('$stateChangeSuccess', setupLayout);
  };
}]);
