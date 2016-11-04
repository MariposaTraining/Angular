Rails.application.routes.draw do
  root  'spa#index'
  get   '/Api/:endpoint' => 'spa#api'
  post  '/Api/:endpoint' => 'spa#api'
  get   '/Eventbrite' => 'spa#eventbrite'
  get   '/*path' => redirect("/?goto=%{path}")
end