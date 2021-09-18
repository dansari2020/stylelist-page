require "rails_helper"

RSpec.describe AddressesController, regressor: true, type: :routing do
  # === Routes (REST) ===
  it { should route(:get, "/addresses/new").to("addresses#new", {}) }
  it { should route(:get, "/addresses/1/edit").to("addresses#edit", {id: "1"}) }
  it { should route(:patch, "/addresses/1").to("addresses#update", {id: "1"}) }
  it { should route(:post, "/addresses").to("addresses#create", {}) }
  it { should route(:get, "/addresses/1").to("addresses#show", {id: "1"}) }
  # === Callbacks (Before) ===
  # it { should use_before_filter(:verify_authenticity_token) }
  # it { should use_before_filter(:configure_permitted_parameters) }
  # it { should use_before_filter(:authenticate_user!) }
  # it { should use_before_filter(:set_address) }
  # === Callbacks (After) ===
  #  it { should use_after_filter(:verify_same_origin_request) }
  # === Callbacks (Around) ===
end
