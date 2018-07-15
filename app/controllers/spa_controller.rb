require 'net/http'
require "json"

class SpaController < ApplicationController
  before_action :set_endpoints, :check_work_mode
  
  def check_work_mode
    if (WORK_MODE == 'maintenance')
      render:maintenance, layout: false
    end
  end
      
  def index
      render :index, layout: false
  end
  
  # redirection methods for compliance with old blog
  
  def redirect_to_blog
    redirect_to "http://blog.mariposatraining.com"
  end
  
  def redirect_to_longterm_care
    redirect_to "#/LongTermCare/Individual"
  end
  
  def redirect_to_home_health_care
    redirect_to "#/HomeHealthCare/Individual"
  end
  
  def redirect_to_classes
    redirect_to "#/Catalog/Classes"
  end
  
  # succeed methods
  
  def diploma
      
    url = URI(API_URL + "/GetSucceedDiploma");
    
    actor = JSON.parse(params['actor'])
    
    session[:endpoint] = params[:endpoint];
    session[:fullName] = actor['name'];
    
    parameters = {
      'activityId' => params[:activity_id],
      'registration' => params[:registration],
      'name' => actor['name'],
      'emailAddress' => actor['email'],
      'authorization' => params[:authorization]
    }
      
    response = Net::HTTP.post_form(url, parameters);
    result = JSON.parse(response.body)
    
    if (result.key?("ok") and result["ok"] and result.key?("data"))
      redirect_to SITE_URL + "/Succeed/Class/TestResults/" + result["data"] + "/" + get_session_name(result["data"]).gsub(" ", "_")
    end
  end
  
  def succeed
      
    url = URI(API_URL + "/GetSucceedLecture");
    
    actor = JSON.parse(params['actor'])
    
    session[:endpoint] = params[:endpoint];
    session[:fullName] = actor['Name'];
    
    parameters = {
      'endpoint' => params[:endpoint],
      'activityId' => params[:activity_id],
      'registration' => params[:registration],
      'name' => actor['Name'],
      'emailAddress' => actor['Email'],
      'authorization' => params[:authorization]
    }
    
    response = Net::HTTP.post_form(url, parameters);
    
    result = JSON.parse(response.body)
    
    if (result.key?("ok") and result["ok"] and result.key?("data"))
      new_url = URI(API_URL + "/GetLecture")
      lecture_response = Net::HTTP.post_form(new_url, 'lectureSoid': result["data"]);
      lecture_result = JSON.parse(lecture_response.body)
      lecture = lecture_result["data"]
      
      redirect_to SITE_URL + "/Succeed/" + lecture["CourseName"].gsub(" ", "-").gsub("/", "-") + "/Video/" + result["data"] + "/" + get_session_name(result["data"]).gsub(" ", "_")
      
    else
      
      redirect_to SITE_URL + "/Succeed/"
      
    end
    
  end
  
  def succeed_course_completed
    
    url = URI(API_URL + "/GetTinCanMessageForCourseCompleted/")
    
    parameters = {
      "lectureSoid" => params["lectureSoid"]
    }
    response = Net::HTTP.post_form(url, parameters)
    uri_succeed = URI(get_session_endpoint + "statements")
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
    uri_succeed = URI(get_session_endpoint + "statements")
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
    uri_succeed = URI(get_session_endpoint + "statements")
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
  
  def get_session_endpoint
    
    if(session[:endpoint])
      session[:endpoint]
    else
      url_new = URI(API_URL + "/GetLecture/");
      parameters_new = {"lectureSoid" => params["lectureSoid"]}
      
      response_new = Net::HTTP.post_form(url_new, parameters_new)
      result_new = JSON.parse(response_new.body)
      
      if(result_new.key?('ok') and result_new["ok"] and result_new.key?("data") and result_new["data"]["Source"])
        session[:endpoint] = result_new["data"]["Source"]
      else  
        nil
      end
      
    end
  end
  
  def get_session_name (lectureSoid)
    
    if(session[:fullName])
      session[:fullName]
    else
      url_new = URI(API_URL + "/GetLecture/");
      parameters_new = {"lectureSoid" => lectureSoid}
      
      response_new = Net::HTTP.post_form(url_new, parameters_new)
      result_new = JSON.parse(response_new.body)
      
      if(result_new.key?('ok') and result_new["ok"] and result_new.key?("data") and result_new["data"]["MemberName"])
        session[:fullName] = result_new["data"]["MemberName"]
      else  
        nil
      end
      
    end
  end
    
  def succeed_slide_progress
    
    url = URI(API_URL + "/GetTinCanMessageForSlideProgressed/")
    parameters = {
      "lectureSoid" => params["lectureSoid"],
      "slideNumber" => params["slideNumber"]
    }
    response = Net::HTTP.post_form(url, parameters)
    
    result = JSON.parse(response.body)
    
    if(response.code.to_i < 400 and result.key?('ok') and result["ok"])
    
      uri_succeed = URI(get_session_endpoint + "statements")
      
      data_succeed = JSON.parse(response.body)["data"]
      response_succeed = post_json(uri_succeed, data_succeed)
      head response_succeed.code
    
    else
      head response.code
    end
  end
  
  def log
    logger.debug params[:data]
    render json: {ok: true}
  end
  
  # GET   /api/:endpoint
  # POST  /api/:endpoint
  def api
    endpoint = params[:endpoint]
    
    uri = URI("#{API_URL}/#{endpoint}")

    req = Net::HTTP::Post.new(uri.path, 'Content-Type' => 'application/json')
  #  req['token'] = "ZWU0NzE4ODEtN2M0NC00ZDJhLTgxOGItMDc1YzE0YWM0ZDJl"

    req.body = params.to_json
    http = Net::HTTP.new(uri.hostname, uri.port)
    response1 = http.request(req)

    begin
      #puts response1.body
      json = JSON.parse(response1.body)
      
      if(endpoint=='getCatalog')
        get_images(json)
      end
      
      # sometimes response contains data object with necessary data
      # but sometimes the response from the server is the object with necessery data
      # without the wrapper
      
      if json.key?('data') and json['data'].is_a?(Hash) and json['data'].key?('data') then
        render json: JSON.parse(response1.body)['data']
      else
        render json: JSON.parse(response1.body)
      end
      
    rescue StandardError => error
      puts error
      render json: {api_response: response1.body}, status: 500
    end
  end
  
  def get_images(json_response)
    
    classes = json_response
    
    while (classes.key?('data') and classes["data"].is_a?(Hash)) do
      classes = classes["data"]
    end
    
    classes = classes["Courses"]
    
    for cl in classes do
      
      tmp = cl["SqlId"]

      if(tmp.to_i<10)
        tmp = "0" + tmp.to_s
      end
      
      tmp = tmp.to_s

      get_image("thumbs", tmp, "http://ec2-54-67-60-169.us-west-1.compute.amazonaws.com:9000/Content/Pictures/Classes/Thumbs/"+tmp+".jpg")
      get_image("full_size", tmp, "http://ec2-54-67-60-169.us-west-1.compute.amazonaws.com:9000/Content/Pictures/Classes/"+tmp+".jpg")
      
    end
    
  end
  
  def get_image (img_type, img_name, org_url)
    
    path = Rails.root.to_s + "/public/images/classes/" + img_type + "/" + img_name.to_s + ".jpg"
    
    if ! File.exists?(path)
    
      uri = URI.parse(org_url)
      http = Net::HTTP.new(uri.host, uri.port)
      
      response = http.request(
        Net::HTTP::Get.new(uri.request_uri)
        )
        
      File.open(path, 'wb') { |f| f.write(response.body)}
    
    end

  end
  
  # GET   /eventbrite
  def eventbrite

    time = (Time.new).strftime("%Y-%m-%dT%H:%M:%S");
    uri = URI("https://www.eventbriteapi.com/v3/events/search/?token=AYHGTP4PS3FISELPF45Q&user.id=107697414411&start_date.range_start=#{time}")
    res = Net::HTTP::get(uri)
    render json: res
  end
  
  def show_test_result
    redirect_to "/Class/TestResult/#{params['param'].split('-').first}"  
  end
  
  def set_endpoints
    @api = API_URL
  end
end
