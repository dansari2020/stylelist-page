Rails.application.routes.draw do
  get "mobile", to: "mobile#index"
  root "home#index"
  devise_for :users, path: "auth",
  controllers: {
    registrations: "users/registrations"
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
  resources :feedbacks, only: %i[new create]
end
