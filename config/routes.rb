Rails.application.routes.draw do
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
  put "/profile", to: "users#update", as: "profile_users"
  get "/profile" => redirect("/users")
  resources :upload
end
