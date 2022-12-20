Rails.application.routes.draw do
  default_url_options host: ENV.fetch("DEFAULT_URL") { "salonhouse.herokuapp.com" }
  namespace :admin do
    resources :users
    resources :portfolios
    resources :availabilities, except: [:index]
    resources :languages, except: [:index]
    resources :languages_users, except: [:index]
    resources :social_media, except: [:index]
    resources :service_types, except: [:index]
    resources :specialties, except: [:index]
    resources :addresses, except: [:index]
    resources :services, except: [:index]
    root to: "users#index"
    devise_scope :user do
      get "/login", to: "sessions#new"
      post "/login", to: "sessions#create"
      delete "/logout", to: "sessions#destroy"
    end
  end
  namespace :api do
    devise_scope :user do
      post "/login", to: "sessions#create"
      delete "/logout", to: "sessions#destroy"
    end
  end

  # get "mobile", to: "mobile#index"
  root "home#index"
  get "/contact", to: "home#contact", as: "contact"
  get "/privacy_policy", to: "home#privacy_policy", as: "privacy_policy"
  get "/terms_of_service", to: "home#terms_of_service", as: "terms_of_service"
  get "/robots.txt" => "robots_txts#show"

  devise_for :users, path: "auth",
  controllers: {
    registrations: "users/registrations",
    passwords: "users/passwords"
  }
  get "/auth" => redirect("/auth/sign_up")
  resources :after_register, module: "users"
  get "/settings(/:tab(/:submenu))", to: "users#index", as: "settings",
    defaults: {tab: "profile", subment: ""}
  get "/confirm_email", to: "users#confirm_email", as: "confirm_email"
  get "/reactivation", to: "users#reactivation", as: "reactivation"
  put "/profile", to: "users#update", as: "profile_users"
  get "/profile/edit/:frame(/:component)", to: "users#edit_component", as: "profile_edit"
  get "/profile/view/:frame/:component", to: "users#view_component", as: "profile_view"
  get "/profile" => redirect("/settings")
  resources :portfolios do
    collection do
      delete :destroy_pictures
    end
  end
  get "portfolios" => redirect("/portfolios/new")
  get "auth/check-email", to: "auth#check_email", as: "check_email"
  get "auth/reset-password", to: "auth#reset_password", as: "reset_password"

  get "/:username/porfolios/:id", to: "portfolios#show",
  constraints: ->(request) {
    User.where("username ilike ?", request.path_parameters[:username]).exists?
  }

  get "/:username", to: "home#show",
  constraints: ->(request) {
    User.where("username ilike ?", request.path_parameters[:username]).exists?
  }
  post "/portfolio/:portfolio_id/flags" => "flags#create", :as => "portfolio_flags"
  resources :addresses
  match "/404", to: "errors#not_found", via: :all
  match "/500", to: "errors#internal_server_error", via: :all
end
