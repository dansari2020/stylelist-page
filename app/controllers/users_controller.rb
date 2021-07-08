class UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :user
  before_action :tabs

  def index
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
      elsif params["user"].has_key?("status") && params["user"]["status"] == "completed"
        current_user.completed!
        redirect_back
      else
        respond_to do |format|
          if @user.update(user_params)
            format.html do
              if params["user"]["email"].present?
                return redirect_to confirm_email_path
              elsif params["user"]["deactivate_reason"].present?
                return destroy
              elsif params["user"]["background"].present? || params["user"]["avatar"].present?
                return redirect_back
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
      availabilities_attributes: [:id, :day, "open_at(1i)", "open_at(2i)", "open_at(3i)", "open_at(4i)", "open_at(5i)",
        "close_at(1i)", "close_at(2i)", "close_at(3i)", "close_at(4i)", "close_at(5i)", :opened],
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
end
