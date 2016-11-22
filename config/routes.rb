Rails.application.routes.draw do
  get   '/Api/:endpoint' => 'spa#api'
  post   '/Api/:endpoint' => 'spa#api'
  get   '/Eventbrite' => 'spa#eventbrite'
  get   '/Class/TestResult/:param' => 'spa#show_test_result'
  post  '/Succeed/SlideProgress' => 'spa#succeed_slide_progress'
  get  '/Succeed/SlideProgress' => 'spa#succeed_slide_progress'
  post  '/Succeed/CourseCompleted' => 'spa#succeed_course_completed'
  get  '/Succeed/CourseCompleted' => 'spa#succeed_course_completed'
  post  '/Succeed/TestPassed' => 'spa#succeed_test_passed'
  get  '/Succeed/TestPassed' => 'spa#succeed_test_passed'
  post  '/Succeed/TestFailed' => 'spa#succeed_test_failed'
  get  '/Succeed/TestFailed' => 'spa#succeed_test_failed'
  get   '/class/diploma' => 'spa#diploma'
  get   '/class/succeed' => 'spa#succeed'
  
  root  'spa#index'
end
