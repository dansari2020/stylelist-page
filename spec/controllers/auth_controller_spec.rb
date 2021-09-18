require "rails_helper"

RSpec.describe AuthController, regressor: true, type: :routing do
  # === Routes (REST) ===
  it { should route(:get, "/auth/check-email").to("auth#check_email", {}) }
  it { should route(:get, "/auth/reset-password").to("auth#reset_password", {}) }
  # === Callbacks (Before) ===
  # it { should use_before_filter(:verify_authenticity_token) }
  # it { should use_before_filter(:configure_permitted_parameters) }
  # === Callbacks (After) ===
  #  it { should use_after_filter(:verify_same_origin_request) }
  # === Callbacks (Around) ===
end
