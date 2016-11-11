angular.module('mariposa-training').controller 'TestCtrl',
['$scope', '$state', '$stateParams', 'Lecture', 'Layout', ($scope, $state, $stateParams, Lecture, Layout) ->
  Lecture.find($stateParams['lectureSoid'])
    .then (lecture) ->
      console.log lecture
      $scope.lecture = lecture
      $scope.lecture.getTest()
    .then (test) ->
      console.log test

      # Set window title
      window.document.title = test.CourseName

      $scope.test = test
      $scope.questions = test.Questions
      $scope.currentQuestionIndex = 0

      $scope.nextQuestion = ->
        if $scope.currentQuestionIndex < $scope.questions.length - 1
          $scope.currentQuestionIndex++

      $scope.setCurrentQuestion = (index) ->
        $scope.currentQuestionIndex = index

      $scope.setTestAnswer = (question) ->
        $scope.lecture.setTestAnswer(question.Soid, question.ChosenOptionSoid)

      $scope.completeQuiz = ->
        $scope.lecture.setGradeTest().then ->
          $state.go("testResult", {lectureSoid: $scope.lecture.Soid});

      $scope.allowCompletion = ->
        for question in $scope.test.Questions
          return false unless question.ChosenOptionSoid
        return true

    .catch ->
      # Do something
]
