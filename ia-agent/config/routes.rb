Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  get "up" => "rails/health#show", as: :rails_health_check

  post "ask", to: "ask#create"
  post "ask/report", to: "ask#report"
end
