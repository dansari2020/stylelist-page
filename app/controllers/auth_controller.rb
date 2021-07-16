class AuthController < ApplicationController
  layout "devise"

  def check_email
  end

  def reset_password
    sign_out :user
  end
end
