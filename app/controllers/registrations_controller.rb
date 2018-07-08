class RegistrationsController < ApplicationController
  def create
    Registration
      .find_or_create_by(user_id: registration_params[:user_id])
      .update(registration_params)
    head :ok
  end
  
  private
  
    def registration_params
      params.require(:registration).permit(
        :first_name, :last_name, :email_address, 
        :facility_soid, :facility, :user_id, associations: [], roles: [])
    end
end
