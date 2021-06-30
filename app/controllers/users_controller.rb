class UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :user
  before_action :tabs

  def index
  end

  def confirm_email
  end

  def update
    if params["user"].has_key?("current_password") && !valid_password?
      flash[:error] = "Your current password is wrong"
      render "index"
    elsif @user.update(user_params)
      if params["user"]["email"].present?
        redirect_to confirm_email_path
      else
        redirect_to settings_path(tab: @tab, submenu: @submenu)
      end
    else
      render "index"
    end
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :gender,
      :role, :email, :password, :password_confirmation,
      :deactivate_reason, :deactivate_description)
  end

  def user
    @user ||= current_user
  end

  def valid_password?
    @user.valid_password?(params["user"]["current_password"])
  end

  def tabs
    @tab = params["tab"]
    @submenu = params["submenu"]
  end
end
