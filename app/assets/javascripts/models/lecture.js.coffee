# global angular
# Create angular service from this model
angular.module('mariposa-training').service 'Lecture', ['$http', 'ModelFactory', 'Course', ($http, ModelFactory, Course) ->
  class Lecture
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

  ModelFactory.create '/lectures', Lecture
]
