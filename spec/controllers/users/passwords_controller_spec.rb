require "rails_helper"

RSpec.describe Users::PasswordsController, regressor: true, type: :routing do
  # === Routes (REST) ===
  it { should route(:get, "/auth/password/new").to("users/passwords#new", {}) }
  it { should route(:get, "/auth/password/edit").to("users/passwords#edit", {}) }
  it { should route(:patch, "/auth/password").to("users/passwords#update", {}) }
  it { should route(:post, "/auth/password").to("users/passwords#create", {}) }
  # === Callbacks (Before) ===
  # it { should use_before_filter(:require_no_authentication) }
  # it { should use_before_filter(:assert_is_devise_resource!) }
  # it { should use_before_filter(:verify_authenticity_token) }
  # it { should use_before_filter(:configure_permitted_parameters) }
  # it { should use_before_filter(:assert_reset_token_passed) }
  # === Callbacks (After) ===
  #  it { should use_after_filter(:verify_same_origin_request) }
  # === Callbacks (Around) ===
end
