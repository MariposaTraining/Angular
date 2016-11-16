require 'net/http'
require "json"

class SpaController < ApplicationController
  before_action :set_endpoints
  
  def index
    render :index, layout: false
  end
  
  def diploma
      
    url = URI(API_URL + "/GetSucceedDiploma");
    
    session[:endpoint] = params[:endpoint];
    
    parameters = {
      'activityId' => params[:activity_id],
      'registration' => params[:registration],
      'name' => params['actor']['name'],
      'emailAddress' => params['actor']['email'],
      'authorization' => params[:authorization]
    }
      
    response = Net::HTTP.post_form(url, parameters);
    result = JSON.parse(response.body)
    
    if (result.key?("ok") and result["ok"] and result.key?("data"))
      redirect_to SITE_URL + "/#/Succeed/Class/TestResults/" + result["data"]
    end
  end
  
  def succeed
      
    url = URI(API_URL + "/GetSucceedLecture");
    
    session[:endpoint] = params[:endpoint];
    
    parameters = {
      'endpoint' => params[:endpoint],
      'activityId' => params[:activity_id],
      'registration' => params[:registration],
      'name' => params['actor']['Name'],
      'emailAddress' => params['actor']['Email'],
      'authorization' => params[:authorization]
    }
    
    response = Net::HTTP.post_form(url, parameters);
    result = JSON.parse(response.body)
    
    if (result.key?("ok") and result["ok"] and result.key?("data"))
      new_url = URI(API_URL + "/GetLecture")
      lecture_response = Net::HTTP.post_form(new_url, 'lectureSoid': result["data"]);
      lecture_result = JSON.parse(lecture_response.body)
      lecture = lecture_result["data"]
      redirect_to SITE_URL + "/#/Succeed/" + lecture["CourseName"].gsub(" ", "-") + "/Video/" + result["data"]
    end
    
  end
  
  def succeed_course_completed
    
    url = URI(API_URL + "/GetTinCanMessageForCourseCompleted/")
    
    parameters = {
      "lectureSoid" => params["lectureSoid"]
    }
    response = Net::HTTP.post_form(url, parameters)
    uri_succeed = URI(session[:endpoint] + "statements")
    data_succeed = JSON.parse(response.body)["data"]
    response_succeed = post_json(uri_succeed, data_succeed)
    
    head response_succeed.code
  end
    
  def succeed_test_passed
    
    url = URI(API_URL + "/GetTinCanMessageForTestPassed/")
    
    parameters = {
      "lectureSoid" => params["lectureSoid"]
    }
    response = Net::HTTP.post_form(url, parameters)
    uri_succeed = URI(session[:endpoint] + "statements")
    data_succeed = JSON.parse(response.body)["data"]
    response_succeed = post_json(uri_succeed, data_succeed)
    
    head response_succeed.code
  end
  

  def succeed_test_failed
    
    url = URI(API_URL + "/GetTinCanMessageForTestFailed/")
    parameters = {
      "lectureSoid" => params["lectureSoid"]
    }
    response = Net::HTTP.post_form(url, parameters)
    uri_succeed = URI(session[:endpoint] + "statements")
    data_succeed = JSON.parse(response.body)["data"]
    response_succeed = post_json(uri_succeed, data_succeed)
    
    head response_succeed.code
  end
  
  def post_json (uri_succeed, data_succeed)
    req = Net::HTTP::Post.new(uri_succeed.path, 'Content-Type' => 'application/json')
    req.body = data_succeed
    http = Net::HTTP.new(uri_succeed.hostname, uri_succeed.port)
    http.use_ssl = uri_succeed.scheme == "https"
    response_succeed = http.request(req)
  end
    
  def succeed_slide_progress
    url = URI(API_URL + "/GetTinCanMessageForSlideProgressed/")
    parameters = {
      "lectureSoid" => params["lectureSoid"],
      "slideNumber" => params["slideNumber"]
    }
    response = Net::HTTP.post_form(url, parameters)
    
    uri_succeed = URI(session[:endpoint] + "statements")
    data_succeed = JSON.parse(response.body)["data"]
    response_succeed = post_json(uri_succeed, data_succeed)
    head response_succeed.code
  end
  
  # GET   /api/:endpoint
  # POST  /api/:endpoint
  def api
    endpoint = params[:endpoint]
    uri = URI("#{API_URL}/#{endpoint}")
    
    res = Net::HTTP.post_form(uri, params)
    begin
      puts res.body
      json = JSON.parse(res.body)
      
      # sometimes response contains data object with necessary data
      # but sometimes the response from the server is the object with necessery data
      # without the wrapper
      
      if json.key?('data') and json['data'].is_a?(Hash) and json['data'].key?('data') then
        render json: JSON.parse(res.body)['data']
      else
        render json: JSON.parse(res.body)
      end
      
    rescue StandardError => error
      puts error
      render json: {api_response: res.body}, status: 500
    end
  end
  
  # GET   /eventbrite
  def eventbrite
    uri = URI("#{EVENTBRITE_URL}")
    res = Net::HTTP::get(uri)
    render :plain => res
  end
  
  def show_test_result
    redirect_to "/#/Class/TestResult/#{params['param'].split('-').first}"  
  end
  
  def set_endpoints
    @player = PLAYER_URL
    @site = SITE_URL
    @api = API_URL
  end
end
