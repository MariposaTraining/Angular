# global angular
# Create angular service from this model
angular.module('mariposa-training').factory 'Lecture', ['$http', 'BaseModelClass', 'Course', ($http, BaseModelClass, Course) ->
  class Lecture extends BaseModelClass
    @find: (id) ->
      $http.post('/Api/GetLecture', {lectureSoid: id}).then (response) ->
        new Lecture response.data.data
  
    afterInitialize: ->
      @savedProgress = 0
      for instance in @Instances
        if instance.TimeThrough > @savedProgress
          @savedProgress = instance.TimeThrough

    getCourse: ->
      Course.find @CourseSoid

    setWatch: ->
      @legacyApi('setWatch')

    setProgress: (slide, time) ->
      @legacyApi('setProgress', {latestSlideSeen: slide, timeThrough: time})

    setCompleteViewing: ->
      @legacyApi('setCompleteViewing')

    getTest: ->
      @legacyApi('getTest').then (response) -> response.data

    setTestAnswer: (questionSoid, optionSoid) ->
      @legacyApi('setTestAnswer', {questionSoid: questionSoid, optionSoid: optionSoid})

    setGradeTest: ->
      @legacyApi('setGradeTest')

    legacyApi: (request, data) ->
      payload = {request: request}
      payload.data = JSON.stringify data if data
      $http.post("#{@apiEndpoint}/#{@Soid}/legacyApi.json", payload)

    wasCompleted: ->
      @Status not in ['Incomplete', 'InQueue']

  Lecture
]