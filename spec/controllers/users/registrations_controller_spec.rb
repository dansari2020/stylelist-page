require "rails_helper"

RSpec.describe Users::RegistrationsController, regressor: true, type: :routing do
  # === Routes (REST) ===
  it { should route(:get, "/auth/cancel").to("users/registrations#cancel", {}) }
  it { should route(:get, "/auth/sign_up").to("users/registrations#new", {}) }
  it { should route(:get, "/auth/edit").to("users/registrations#edit", {}) }
  it { should route(:patch, "/auth").to("users/registrations#update", {}) }
  it { should route(:post, "/auth").to("users/registrations#create", {}) }
  it { should route(:delete, "/auth").to("users/registrations#destroy", {}) }
  # === Callbacks (Before) ===
  # it { should use_before_filter(:set_minimum_password_length) }
  # it { should use_before_filter(:authenticate_scope!) }
  # it { should use_before_filter(:require_no_authentication) }
  # it { should use_before_filter(:assert_is_devise_resource!) }
  # it { should use_before_filter(:verify_authenticity_token) }
  # it { should use_before_filter(:configure_permitted_parameters) }
  # === Callbacks (After) ===
  #  it { should use_after_filter(:verify_same_origin_request) }
  # === Callbacks (Around) ===
end
