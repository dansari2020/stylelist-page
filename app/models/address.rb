class Address < ApplicationRecord
  belongs_to :user

  def country
    @country ||= ISO3166::Country[country_code]
  end

  def full_address
    if privacy?
      "Your address has been hidden"
    else
      [street_number, city, province, postal, country.name].reject { |e| e.blank? }.compact.join(", ")
    end
  end

  def short_address
    [city, province].reject { |e| e.to_s.empty? }.compact.join(", ")
  end

  def street_number
    [unit_suit, street].reject { |e| e.blank? }.compact.join(" - ").strip
  end
end
