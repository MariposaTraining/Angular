angular.module('mariposa-training').directive 'player',
['$rootScope', '$state', '$interval', '$sce', 'ngAudio', '$localStorage', 'Lecture', 'Course', 'Account', 'Logger',
($rootScope, $state, $interval, $sce, ngAudio, $localStorage, Lecture, Course, Account, Logger) ->
  restrict: 'E'
  templateUrl: 'directive/player.html'
  scope:
    lectureId: '='
    courseId: '='
    state: '@'
    type: '@'
  link: (scope, element, attrs) ->

    onLoad = (lecture, course) ->

      # Set window title

      window.document.title = course.Name

      #Initialize the variables

      scope.lecture = lecture
      scope.course  = course
      scope.audio   = ngAudio.load scope.course.audioUrl()

      scope.savedProgress = 0
      scope.seekable      = 0

      updateInterval       = null
      intervalStarted      = false
      scope.playing        = false
      scope.showText       = true
      scope.showMedia      = true
      scope.showCEUWarning = false
      
      chooseActionOnViewed = (lecture) ->
        try
          if !lecture.TestPassed
            Account.test(lecture.Soid)
          else if $state.current.name.indexOf("Succeed") != -1
            fullName = ""
            if $state.params["fullName"]
              fullName = $state.params["fullName"]
            $state.go("testResultSucceed", {lectureSoid: scope.lecture.Soid, fullName: fullName})
          else
            $state.go("accountDiploma", {lectureSoid: scope.lecture.Soid})
        catch error 
          Logger.logData("Player: setCompleteViewing callback: Lecture.find callback: catch", error);
    
      
      completeViewingCallback = (result) ->
        try
          Lecture.find(scope.lecture.Soid).then(chooseActionOnViewed)
        catch error
          Logger.logData("Player: setCompleteViewing callback: catch", error);

      # Functions for measuring time elapsed since audio started

      saveProgress = ->
        if scope.lecture
          scope.lecture.setProgress(scope.course.currentSlideIndex, scope.audio.currentTime)
            
      restoreProgress = ->
        if scope.lecture
          scope.savedProgress = scope.lecture.savedProgress
        else
          scope.savedProgress = 1

      updateSeekable = ->
        buffered = scope.audio.audio.buffered
        bufferedEnd = 0
        if buffered.length > 0
          bufferedEnd = buffered.end(buffered.length - 1)

        duration =  scope.audio.duration;
        scope.seekable = Math.min(scope.savedProgress, (bufferedEnd / duration))

      updateProgress = ->
        updateSeekable()

        scope.currentTime = clockFormat(scope.audio.currentTime)
        scope.totalTime = totalTime()
        scope.currentSlide = scope.course.chooseNextSlide scope.audio.currentTime
        
        if !scope.currentSlide.played
          saveProgress()
          if scope.currentSlide?.type == 'video'
            pause()
            playVideoSlide()

        if scope.audio.progress >= 1
          scope.lecture.setCompleteViewing().then(completeViewingCallback)

        scope.currentSlide.played = true

      playVideoSlide = ->
        onPlayerReady = (event) ->
          event.target.seekTo(0, false)
          event.target.playVideo()

        onPlayerStateChange = (event) ->
          if event.data == YT.PlayerState.ENDED
            play()

        player = new YT.Player('slide-video', {
          height: '100%'
          width: '100%'
          videoId: scope.currentSlide.url
          events: {
            'onReady': onPlayerReady
            'onStateChange': onPlayerStateChange
          }
        })

      startInterval = ->
        unless intervalStarted
          updateInterval = $interval updateProgress, 200
          intervalStarted = true

      stopInterval = ->
        if intervalStarted
          $interval.cancel updateInterval
          updateInterval = null
          intervalStarted = false

      # Functions to control the player

      play = ->
        scope.audio.play()
        scope.playing = true
        startInterval()

      pause = ->
        scope.audio.pause()
        scope.playing = false
        stopInterval()

      start = ->
        restoreProgress()
        startInterval()
        scope.toggle()

      scope.toggle = ->
        unless scope.playing
          play()
        else
          pause()

      scope.stop = ->
        scope.audio.stop()
        scope.playing = false
        scope.course.resetSlides()
        stopInterval()

      scope.mute = ->
        scope.audio.volume = 0

      scope.fullVolume = ->
        scope.audio.volume = 1

      scope.customVolume = ($event) ->
        scope.audio.volume = $event.layerX / 60

      scope.seek = ($event) ->
        scope.course.resetSlides()
        target = $event.layerX / $('#seek-bar').width()
        seekTo = Math.min(target, scope.seekable)
        duration = scope.audio.duration
        scope.audio.currentTime = seekTo * duration

      scope.toggleMedia = ->
        if scope.showMedia
          scope.showMedia = false if scope.showText
        else
          scope.showMedia = true

        onResize()
        null

      scope.toggleText = ->
        if scope.showText
          scope.showText = false if scope.showMedia

        else
          scope.showText = true

        onResize()
        null

      scope.acknowledgeWarning = ->
        scope.showCEUWarning = false;
        start()

      scope.currentVideoURL = ->
        $sce.trustAsResourceUrl(
          "http://www.youtube.com/embed/" + scope.currentSlide.url + "?autoplay=1");
          
      scope.getDiploma = ->
        if scope.lecture.TestPassed
          if $state.current.name.indexOf("Succeed") != -1
            fullName = ""
            if $state.params["fullName"]
              fullName = $state.params["fullName"]
            $state.go("testResultSucceed", {lectureSoid: scope.lecture.Soid, fullName: fullName});
          else
            $state.go("accountDiploma", {lectureSoid: scope.lecture.Soid});
        else
          return
        
      scope.takeTest = ->
        if scope.lecture.Viewed
          Account.test(scope.lecture.Soid)
        else
          return

      # Helpers

      twoDigits = (number) ->
        str = number.toString()
        if str.length == 1 then '0' + str else str

      clockFormat = (time) ->
        seconds = Math.round(time)
        minutes = Math.floor(seconds / 60)
        seconds = seconds - minutes * 60
        minutes + ':' + twoDigits(seconds)

      totalTimeMem = null
      totalTime = ->
        return totalTimeMem if totalTimeMem
        totalTimeMem = scope.audio.currentTime + scope.audio.remaining
        unless isNaN(totalTimeMem)
          totalTimeMem = clockFormat totalTimeMem
          return totalTimeMem
        clockFormat 0

      # Autoplay if lecture was completed before,
      # otherwise, show the CEU warning
      scope.showCEUWarning = !scope.lecture.wasCompleted()
      start() unless scope.showCEUWarning

      # Stop when navigating off the player page
      $rootScope.$on '$stateChangeSuccess', (event) ->
        if $state.current.name != scope.state
          scope.stop()
          if $state.current.name.indexOf("Suceed") == -1
            Account.reloadMemberObject()

    if scope.type == 'lecture'
      lectureIdWatcher = scope.$watch('lectureId', ->
        if scope.lectureId
          lectureIdWatcher() # Disable the watcher
          Lecture.find(scope.lectureId).then (lecture) ->
            lecture.getCourse().then (course) ->
              onLoad(lecture, course)
      )

    if scope.type == 'course'
      courseIdWatcher = scope.$watch('courseId', ->
        if scope.courseId
          courseIdWatcher() # Disable the watcher
          Course.find(scope.courseId).then (course) ->
            onLoad(null, course)
      )
]