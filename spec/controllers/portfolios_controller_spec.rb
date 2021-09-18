require "rails_helper"

RSpec.describe PortfoliosController, regressor: true, type: :routing do
  # === Routes (REST) ===
  it { should route(:get, "/portfolios/new").to("portfolios#new", {}) }
  it { should route(:delete, "/portfolios/destroy_pictures").to("portfolios#destroy_pictures", {}) }
  it { should route(:get, "/portfolios/1/edit").to("portfolios#edit", {id: "1"}) }
  it { should route(:patch, "/portfolios/1").to("portfolios#update", {id: "1"}) }
  it { should route(:post, "/portfolios").to("portfolios#create", {}) }
  it { should route(:get, "/portfolios/1").to("portfolios#show", {id: "1"}) }
  it { should route(:get, "/portfolios").to("portfolios#index", {}) }
  it { should route(:delete, "/portfolios/1").to("portfolios#destroy", {id: "1"}) }
  # === Callbacks (Before) ===
  # it { should use_before_filter(:verify_authenticity_token) }
  # it { should use_before_filter(:configure_permitted_parameters) }
  # it { should use_before_filter(:authenticate_duck!) }
  # it { should use_before_filter(:portfolio) }
  # it { should use_before_filter(:editable) }
  # === Callbacks (After) ===
  #  it { should use_after_filter(:verify_same_origin_request) }
  # === Callbacks (Around) ===
end
