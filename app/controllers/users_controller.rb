class UsersController < ApplicationController
  layout :resolve_layout
  before_action :authenticate_user!
  before_action :user
  before_action :tabs

  def index
  end

  def view_component
    current_user.reload
    current_user.specialties.reload
    render turbo_stream: turbo_stream.replace(params[:frame], partial: "components/#{params[:component]}/view", locals: {user: current_user, editable: true})
  end

  def edit_component
    render turbo_stream: turbo_stream.replace(params[:frame], partial: "components/#{params[:component] || params[:frame]}/edit", locals: {user: current_user, editable: true, url: profile_users_path, from_url: root_url})
  end

  def confirm_email
  end

  def reactivation
  end

  def update
    if params["user"].present?
      if params["user"].has_key?("current_password") && !valid_password?
        flash[:error] = "Your current password is wrong"
        redirect_back
      elsif params["user"].has_key?("status") && params["user"]["status"] == "activated"
        current_user.activated!
        redirect_back
      else
        respond_to do |format|
          if @user.update(user_params)
            bypass_sign_in current_user if update_with_password?

            if params[:component].present? && params[:frame].present?
              format.turbo_stream do
                return render turbo_stream: turbo_stream.replace(params[:frame], partial: "components/#{params[:component]}/view", locals: {user: current_user, editable: true})
              end
            end
            format.html do
              flash[:success] = "Your profile was updated successfully!"
              if params["user"]["email"].present?
                return redirect_to confirm_email_path
              elsif params["user"]["deactivate_reason"].present?
                return destroy
              else
                return redirect_back
              end
            end
            format.json do
              if params["user"]["background"].present? || params["user"]["avatar"].present?
                return render json: @user, status: :created, location: root_url
              end
            end
          else
            flash[:error] = @user.errors.full_messages
            format.html do
              return redirect_back
            end
            if params[:component].present? && params[:frame].present?
              format.turbo_stream do
                render turbo_stream: turbo_stream.replace(params[:frame], partial: "components/#{params[:component]}/edit", locals: {user: current_user, editable: true, url: profile_users_path, from_url: root_url})
              end
            end
          end
        end
      end
    else
      redirect_back
    end
  end

  def destroy
    unless @user.deactivated?
      @user.deactivated!
      Devise.sign_out_all_scopes ? sign_out : sign_out(@user)
      flash[:success] = "You’ve deactivated your account. You can log back in to re-activate. We hope to see you again"
      redirect_to new_user_session_path
    end
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :pronoun, :background, :avatar,
      :email, :password, :password_confirmation, :phone, :phone_method, :phone_type,
      :role, :bio, :started_at, :education, :deactivate_reason, :deactivate_description,
      :client_incentives, :condition_for_incenrive,
      language_ids: [],
      specialties_attributes: [:id, :name, :_destroy],
      services_attributes: [:id, :name, :_destroy],
      social_media_attributes: [:id, :kind, :url, :_destroy],
      availabilities_attributes: [:id, :opened, :day, :open_at, :close_at],
      address_attributes: [:id, :country_code, :salon_name, :street, :unit_suit, :city, :province,
        :postal, :privacy])
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

  def redirect_back
    redirect_to(params[:from_url] || root_url)
  end

  def update_with_password?
    user_params[:password].present? && user_params[:password_confirmation].present?
  end

  private

  def resolve_layout
    case action_name
    when "confirm_email", "reactivation"
      "register_steps"
    else
      "application"
    end
  end
end
