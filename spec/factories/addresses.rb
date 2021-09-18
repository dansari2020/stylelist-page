FactoryBot.define do
  factory :address do
    user
    country_code { Faker::Address.country_code }
    salon_name { Faker::Company.name }
    street { Faker::Address.street_name }
    unit_suit { Faker::Address.building_number }
    city { Faker::Address.city }
    province { Faker::Address.state }
    postal { Faker::Address.zip_code }
  end
end
