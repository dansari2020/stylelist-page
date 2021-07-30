class HomeController < ApplicationController
  before_action :authenticate_duck
  before_action :editable
  def index
  end

  def show
  end

  private

  def editable
    @editable = current_user.present? && (params[:username].nil? || current_user.username == params[:username])
    @user = if @editable
      current_user
    elsif params[:username].present?
      User.includes(:address, :specialties, :services, :availabilities, :social_media, :portfolios)
        .find_by!(username: params[:username])
    end
  end
end
