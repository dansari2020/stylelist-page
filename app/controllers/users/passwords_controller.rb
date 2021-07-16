class Users::PasswordsController < Devise::PasswordsController
  protected

  def after_sending_reset_password_instructions_path_for(resource_name)
    check_email_path
  end

  def after_resetting_password_path_for(resource)
    reset_password_path
  end
end
