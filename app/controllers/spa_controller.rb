class SpaController < ApplicationController
  before_action :set_endpoints
  
  def index
    render :index, layout: false
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
