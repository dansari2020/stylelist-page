class Users::AfterRegisterController < ApplicationController
  include Wicked::Wizard
  before_action :authenticate_user!
  before_action :user, only: %i[show update]
  steps :job, :handle, :information, :bio, :specialties, :services, :education,
    :experience, :social_media
  layout "register_steps"

  def show
    if @user.profile_activated?
      redirect_to(root_url)
    else
      render_wizard
    end
  end

  def update
    @user.next_step(step)
    if step == :information
      @user.skip_confirmation! if ["true", true, "1"].include?(ENV.fetch("USER_SKIP_CONFIRMATION", true))
      @user.activated!
      @user.save
      render turbo_stream: turbo_stream.replace("register_steps", partial: "shared/handle", locals: {user: current_user, editable: true})
      head :created, url: root_url
    else
      respond_to do |format|
        if @user.update(user_params) && %i[bio specialties services education experience social_media].include?(step)
          jump_to(:information)
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
