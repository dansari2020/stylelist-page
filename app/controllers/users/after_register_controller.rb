class Users::AfterRegisterController < ApplicationController
  include Wicked::Wizard
  before_action :authenticate_user!
  steps :job, :handle, :final
  layout "register_steps"

  def show
    @user = current_user
    if step == :final || @user.completed?
      redirect_to(root_url)
    else
      render_wizard
    end
  end

  def update
    byebug
    @user = current_user
    if step == :final
      @user.completed!
      redirect_to(root_url)
    else
      @user.update(user_params)
      render_wizard @user
    end
  end

  def user_params
    params.require(:user).permit(:role, :username)
  end
end
