class Users::AfterRegisterController < ApplicationController
  include Wicked::Wizard
  before_action :authenticate_user!
  steps :job, :handle, :final
  layout "register_steps"

  def show
    @user = current_user
    case step
    when :add_twitter
      skip_step if @user.zip.blank?
    end
    render_wizard
  end

  def update
    @user = current_user
    @user.update(user_params)
    render_wizard @user
  end

  def user_params
    params.require(:user).permit(:role, :username)
  end
end
