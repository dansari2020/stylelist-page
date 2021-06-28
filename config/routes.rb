Rails.application.routes.draw do
  root "home#index"
  devise_for :users, path: "auth",
  controllers: {
    registrations: "users/registrations"
  }
  resources :after_register, module: "users"
end
