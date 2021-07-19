Rails.application.routes.draw do
  namespace :admin do
    resources :users
    # resources :hair_types
    resources :portfolios
    # resources :availabilities
    # resources :languages
    # resources :languages_users
    # resources :social_media
    # resources :service_types
    resources :feedbacks
    # resources :specialties
    # resources :addresses
    # resources :services
    root to: "users#index"
  end
  get "mobile", to: "mobile#index"
  root "home#index"
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
  get "/profile/edit/:frame", to: "users#edit_component", as: "profile_edit"
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
  resources :feedbacks, only: %i[new create]
end
