# global angular
# Create angular service from this model
angular.module('mariposa-training').factory 'Lecture', ['$http', '$state', 'BaseModelClass', 'Course', 'Account', ($http, $state, BaseModelClass, Course, Account) ->
  class Lecture extends BaseModelClass
    @find: (id) ->
      $http.post('/Api/GetLecture', {lectureSoid: id}).then (response) ->
        new Lecture response.data.data
  
    afterInitialize: ->
      @savedProgress = if @Viewed then 1 else 0

    getCourse: ->
      Course.find @CourseSoid

    setWatch: ->
      @legacyApi('setWatch')

    setProgress: (slide, time) ->
      @legacyApi('setProgress', {lectureSoid: @Soid, latestSlideSeen: slide, timeThrough: time}).then (response) =>
        if $state.current.name.includes("Succeed")  
          @succeedApi('SlideProgress', {lectureSoid: @Soid, slideNumber: slide})

    setCompleteViewing: ->
      @legacyApi('setCompleteViewing', {lectureSoid: @Soid}).then (response) =>
        if $state.current.name.includes("Succeed")  
          @succeedApi('CourseCompleted', {lectureSoid: @Soid})
        else
          Account.reloadMemberObject()

    getTest: ->
      @legacyApi('getTest', {lectureSoid: @Soid}).then (response) ->
        response.data.data

    setTestAnswer: (questionSoid, optionSoid) ->
      @legacyApi('setTestAnswer', {lectureSoid: @Soid, questionSoid: questionSoid, optionSoid: optionSoid})

    setGradeTest: ->
      @legacyApi('setGradeTest', {lectureSoid: @Soid})
      
    sendTestPassed: (soid) ->
      @succeedApi('TestPassed', {lectureSoid: soid})
      
    sendTestFailed: (soid) ->
      @succeedApi('TestFailed', {lectureSoid: soid})

    legacyApi: (request, data = {}) ->
      $http.post("/Api/#{request}", data)
      
    succeedApi: (request, data ={}) ->
      $http.post("/Succeed/#{request}", data)

    wasCompleted: ->
      @Status not in ['Incomplete', 'InQueue']

  Lecture
]
