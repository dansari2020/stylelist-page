class Address < ApplicationRecord
  belongs_to :user

  def country
    @country ||= ISO3166::Country[country_code]
  end

  def full_address
    if privacy?
      "Your address has been hidden"
    else
      [salon_name, street_number, city_address, country.name].reject { |e| e.blank? }.compact
    end
  end

  def short_address
    [city, province].reject { |e| e.to_s.empty? }.compact.join(", ")
  end

  def street_number
    [street, unit_suit].reject { |e| e.blank? }.compact.join(", ").strip
  end

  def city_address
    [city, province, postal].reject { |e| e.blank? }.compact.join(", ").strip
  end
end
