require "rails_helper"

RSpec.describe FlagsController, regressor: true, type: :routing do
  # === Routes (REST) ===
  it { should route(:post, "/portfolio/1/flags").to("flags#create", {portfolio_id: "1"}) }
  # === Callbacks (Before) ===
  # it { should use_before_filter(:verify_authenticity_token) }
  # it { should use_before_filter(:configure_permitted_parameters) }
  # === Callbacks (After) ===
  #  it { should use_after_filter(:verify_same_origin_request) }
  # === Callbacks (Around) ===
end
