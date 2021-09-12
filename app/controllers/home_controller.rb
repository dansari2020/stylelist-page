class HomeController < ApplicationController
  before_action :authenticate_duck
  before_action :editable
  def index
    redirect_to admin_users_path if current_user.present? && current_user.admin?
  end

  def show
  end

  def feedback
  end

  def contact
  end

  def privacy_policy
  end

  def terms_of_service
  end

  private

  def editable
    if ["404", "400", "401", "500"].exclude? params[:username]
      @editable = current_user.present? && (params[:username].nil? ||
        current_user.username.downcase == params[:username].downcase)
      @user = if @editable
        current_user
      elsif params[:username].present?
        User.includes(:address, :specialties, :services, :availabilities, :social_media, :portfolios)
          .find_by!("username ilike ?", params[:username])
      end
    end
  end
end
