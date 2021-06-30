class Users::AfterRegisterController < ApplicationController
  include Wicked::Wizard
  before_action :authenticate_user!
  before_action :user, only: %i[show update]
  steps :job, :handle, :final, :bio, :specialties, :services, :education,
    :experience, :social_media
  layout "register_steps"

  def show
    byebug
    if @user.profile_completed?
      redirect_to(root_url)
    else
      render_wizard
    end
  end

  def update
    if step == :final
      @user.completed!
      redirect_to(root_url)
    else
      @user.update(user_params)
      if %i[bio specialties services education experience social_media].include?(step)
        jump_to(:final)
      end
      render_wizard @user
    end
  end

  private

  def user_params
    params.require(:user).permit(:role, :username, :bio, :started_at, :education,
      specialties_attributes: [:id, :name, :_destroy],
      services_attributes: [:id, :name, :_destroy],
      social_media_attributes: [:id, :kind, :url, :_destroy])
  end

  def user
    @user ||= current_user
  end
end
