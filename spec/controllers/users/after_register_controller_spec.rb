require "rails_helper"

RSpec.describe Users::AfterRegisterController, regressor: true, type: :routing do
  # === Routes (REST) ===
  it { should route(:get, "/after_register/1").to("users/after_register#show", {id: "1"}) }
  it { should route(:patch, "/after_register/1").to("users/after_register#update", {id: "1"}) }
  it { should route(:get, "/after_register").to("users/after_register#index", {}) }
  # === Callbacks (Before) ===
  # it { should use_before_filter(:verify_authenticity_token) }
  # it { should use_before_filter(:configure_permitted_parameters) }
  # it { should use_before_filter(:setup_wizard) }
  # it { should use_before_filter(:authenticate_user!) }
  # it { should use_before_filter(:user) }
  # === Callbacks (After) ===
  #  it { should use_after_filter(:verify_same_origin_request) }
  # === Callbacks (Around) ===
end
