FactoryBot.define do
  factory :user do
    sequence :username do |n|
      "username#{n}"
    end
    email { Faker::Internet.email }
    password { "123456aA" }
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
  end
end
