require "rails_helper"

RSpec.describe UsersController, regressor: true, type: :routing do
  # === Routes (REST) ===
  it { should route(:get, "/profile/view/1/1").to("users#view_component", {component: "1", frame: "1"}) }
  it { should route(:get, "/profile/edit/1").to("users#edit_component", {frame: "1"}) }
  it { should route(:get, "/confirm_email").to("users#confirm_email", {}) }
  it { should route(:get, "/reactivation").to("users#reactivation", {}) }
  # it { should route(:get, '/settings').to('users#index', {}) }
  # it { should route(:put, '/profile').to('users#update', {}) }
  # === Callbacks (Before) ===
  # it { should use_before_filter(:verify_authenticity_token) }
  # it { should use_before_filter(:configure_permitted_parameters) }
  # it { should use_before_filter(:authenticate_user!) }
  # it { should use_before_filter(:user) }
  # it { should use_before_filter(:tabs) }
  # === Callbacks (After) ===
  #  it { should use_after_filter(:verify_same_origin_request) }
  # === Callbacks (Around) ===
end
