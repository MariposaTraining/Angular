# global angular

# onResize = ->
#   height = $('body').height() - $('#footer').height() - $('#header').height()
#   $('#slide').css('height', height + 'px')

# $ ->
#   onResize()
#   $(window).on 'resize', onResize

angular.module('mariposa-training').directive 'player',
['$interval', '$sce', 'ngAudio', '$localStorage', 'Lecture', 'Course',
($interval, $sce, ngAudio, $localStorage, Lecture, Course) ->
  restrict: 'E'
  templateUrl: 'directive/player.html'
  scope:
    lectureId: '='
    courseId: '='
    type: '@'
  link: (scope, element, attrs) ->

    # onResize()

    onLoad = (lecture, course) ->

      console.log lecture
      console.log course

      # Set window title

      window.document.title = course.Name

      #Initialize the variables

      scope.lecture = lecture
      scope.course  = course
      scope.audio   = ngAudio.load scope.course.audioUrl()

      scope.savedProgress = 0
      scope.seekable      = 0

      updateInterval       = null
      saveInterval         = null
      intervalStarted      = false
      scope.playing        = false
      scope.showText       = true
      scope.showMedia      = true
      scope.showCEUWarning = false

      # Functions for measuring time elapsed since audio started

      saveProgress = ->
        if scope.lecture
          scope.lecture.setProgress(
            scope.course.currentSlideIndex, scope.audio.currentTime)

          console.log scope.audio.progress
          if scope.audio.progress >= 1
            scope.lecture.setCompleteViewing().then ->
              if !scope.lecture.TestPassed
                window.location.href = "/lectures/#{scope.lecture.Soid}/test"

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
        scope.seekable = Math.min scope.savedProgress, bufferedEnd / duration

      updateProgress = ->
        updateSeekable()

        scope.currentTime = clockFormat(scope.audio.currentTime)
        scope.totalTime = totalTime()
        scope.currentSlide = scope.course.chooseNextSlide scope.audio.currentTime

        if scope.currentSlide?.type == 'video' && !scope.currentSlide.played
          pause()
          playVideoSlide()

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
          saveInterval = $interval saveProgress, 5000
          intervalStarted = true

      stopInterval = ->
        if intervalStarted
          $interval.cancel updateInterval
          $interval.cancel saveInterval
          updateInterval = null
          saveInterval = null
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
        progress = $event.layerX / $('body').width()
        scope.audio.progress = Math.min scope.seekable, progress

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
