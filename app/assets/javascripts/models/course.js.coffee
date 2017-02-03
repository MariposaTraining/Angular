# # global angular
# # Create angular service from this model
angular.module('mariposa-training').factory 'Course', ['$sce', '$http', 'BaseModelClass', ($sce, $http, BaseModelClass) ->
  class Course extends BaseModelClass
    @find: (id) ->
      $http.post('/Api/GetCourse', {courseSoid: id}).then (response) ->
        new Course response.data.data
    
    afterInitialize: ->
      @currentSlideIndex = 0
      for slide, i in @Slides
        @initializeSlide slide, i

    initializeSlide: (slide, index) ->
      slide.played = index == 0
      youtubeRegex = /youtube.com\/watch\?v=(.*?)\W/
      match = slide.Transcript?.match youtubeRegex
      if match
        slide.type = 'video'
        slide.url = match[1]
      else
        slide.type = 'image'
        slide.url = @slideUrl index + 1 unless slide.url

      slide.Transcript = $sce.trustAsHtml(slide.Transcript)

    chooseNextSlide: (time) ->
      if !@Slides || @Slides.length == 0
        null
      else
        # Loop through the slides that have already been played
        i = 0; current = @Slides[0]; next = @Slides[1]
        while next.StartTime < time && i < @Slides.length - 1
          current = next
          next = @Slides[++i]

        if next.StartTime > time
          @currentSlideIndex = Math.max i - 1, 0
          current
        else
          @currentSlideIndex = i
          next

    nextSlideStartTime: (time) ->
      if @currentSlideIndex < @Slides.length - 1
        @Slides[@currentSlideIndex + 1].StartTime
      else
        @Slides[@currentSlideIndex].StartTime

    padNumber: (num) ->
      while num.toString().length < 3
        num = "0" + num
      num

    slideUrl: (slideNumber) ->
      paddedSqlId = @padNumber @SqlId
      paddedSlideNumber = @padNumber slideNumber
      "http://ec2-54-67-60-169.us-west-1.compute.amazonaws.com:9000/Content/Presentations/Slides/#{paddedSqlId}/Slides/Slide#{paddedSlideNumber}.JPG"

    audioUrl: ->
      "http://ec2-54-67-60-169.us-west-1.compute.amazonaws.com:9000/Content/Presentations/Audio/#{@Channel}.mp3"

    handoutUrl: ->
      "http://ec2-54-67-60-169.us-west-1.compute.amazonaws.com:9000/Content/Presentations/Handout/#{@padNumber @SqlId}.pdf"

    resetSlides: ->
      for slide, i in @Slides
        slide.played = i == 1

  Course
]