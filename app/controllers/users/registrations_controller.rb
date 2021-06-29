class Users::RegistrationsController < Devise::RegistrationsController
  protected

  def after_inactive_sign_up_path_for(resource)
    after_register_path(:job)
  end

  def after_sign_up_path_for(resource)
    after_register_path(:job)
  end
end
