class Users::AfterRegisterController < ApplicationController
  include Wicked::Wizard
  before_action :authenticate_user!
  before_action :user, only: %i[show update]
  steps :job, :handle, :final, :bio, :specialties, :services, :education,
    :experience, :social_media
  layout "register_steps"

  def show
    if @user.profile_completed?
      redirect_to(root_url)
    else
      render_wizard
    end
  end

  def update
    if step == :final
      @user.skip_confirmation! if ["true", true, "1"].include?(ENV.fetch("USER_SKIP_CONFIRMATION", true))
      @user.completed!
      @user.save
      render turbo_stream: turbo_stream.replace("register_steps", partial: "shared/handle", locals: {user: current_user})
      head :created, url: root_url
    else
      respond_to do |format|
        if @user.update(user_params) && %i[bio specialties services education experience social_media].include?(step)
          jump_to(:final)
        end
        format.html do
          render_wizard @user
        end
      end
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
