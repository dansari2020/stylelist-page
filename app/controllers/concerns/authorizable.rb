module Authorizable
  extend ActiveSupport::Concern

  def after_login_path_for(resource)
    if !current_user.admin?
      if resource.pending?
        after_register_path(resource.register_step || :job)
      elsif resource.deactivated?
        reactivation_path
      elsif resource.activated? && !resource.confirmed?
        confirm_email_path
      end
    end
  end

  def after_login_path_for!(resource)
    url = after_login_path_for(resource)
    redirect_to url if url.present?
  end

  def authenticate_duck!
    authenticate_user!
    after_login_path_for!(current_user)
  end

  def authenticate_duck
    return if current_user.nil?

    after_login_path_for!(current_user)
  end
end
