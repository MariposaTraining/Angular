angular.module('mariposa-training').controller 'TestCtrl',
['$scope', '$state', '$stateParams', 'Lecture', 'Layout', 'Account', ($scope, $state, $stateParams, Lecture, Layout, Account) ->
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
      $scope.showNextBtn = true

      $scope.nextQuestion = ->
        if $scope.currentQuestionIndex < $scope.questions.length - 1
          $scope.currentQuestionIndex++

      $scope.setCurrentQuestion = (index) ->
        $scope.currentQuestionIndex = index

      $scope.setTestAnswer = (question) ->
        $scope.lecture.setTestAnswer(question.Soid, question.ChosenOptionSoid)

      $scope.completeQuiz = ->
        $scope.lecture.setGradeTest().then ->
          if $state.current.name.includes("Succeed")
            Lecture.find($scope.lecture.Soid).then (lecture) ->
              if(lecture.Status == "Completed")
                lecture.sendTestPassed()
              else
                lecture.sendTestFailed()
            fullName = ""
            if $state.params["fullName"]
              fullName = $state.params["fullName"]
            $state.go("testResultSucceed", {lectureSoid: $scope.lecture.Soid, fullName: fullName});
          else
            Account.reloadMemberObject()
            $state.go("testResult", {lectureSoid: $scope.lecture.Soid});

      $scope.allowCompletion = ->
        for question in $scope.test.Questions
          return false unless question.ChosenOptionSoid
        $scope.showNextBtn = false
        return true

    .catch ->
      # Do something
]
