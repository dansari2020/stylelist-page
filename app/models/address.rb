class Address < ApplicationRecord
  belongs_to :user

  def country
    @country ||= ISO3166::Country[country_code]
  end

  def full_address
    if privacy?
      "Your address has been hidden"
    else
      [salon_name, [postal, unit_suit, street].compact.join(" ").strip,
        province, city, country.name].reject { |e| e.to_s.empty? }.compact.join(", ")
    end
  end

  def short_address
    [city, country.name].reject { |e| e.to_s.empty? }.compact.join(", ")
  end
end
