require "rails_helper"

RSpec.describe ErrorsController, regressor: true, type: :routing do
  # === Routes (REST) ===

  # === Callbacks (Before) ===
  # it { should use_before_filter(:verify_authenticity_token) }
  # it { should use_before_filter(:configure_permitted_parameters) }
  # === Callbacks (After) ===
  #  it { should use_after_filter(:verify_same_origin_request) }
  # === Callbacks (Around) ===
end
