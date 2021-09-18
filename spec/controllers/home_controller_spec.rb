require "rails_helper"

RSpec.describe HomeController, regressor: true, type: :routing do
  # === Routes (REST) ===
  it { should route(:get, "/contact").to("home#contact", {}) }
  it { should route(:get, "/privacy_policy").to("home#privacy_policy", {}) }
  it { should route(:get, "/terms_of_service").to("home#terms_of_service", {}) }
  # it { should route(:get, '/1').to('home#show', {:username=>"1"}) }
  it { should route(:get, "/").to("home#index", {}) }
  # === Callbacks (Before) ===
  # it { should use_before_filter(:verify_authenticity_token) }
  # it { should use_before_filter(:configure_permitted_parameters) }
  # it { should use_before_filter(:authenticate_duck) }
  # it { should use_before_filter(:editable) }
  # === Callbacks (After) ===
  #  it { should use_after_filter(:verify_same_origin_request) }
  # === Callbacks (Around) ===
end
