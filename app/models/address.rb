class Address < ApplicationRecord
  include ActionView::RecordIdentifier
  belongs_to :user
  validates :user, presence: true

  def country
    @country ||= ISO3166::Country[country_code]
  end

  def full_address
    if new_record?
      []
    elsif privacy?
      ["Your address has been hidden"]
    else
      ad = [salon_name, street_number, city_address, country&.name].reject { |e| e.blank? }.compact
      if ad.empty?
        []
      else
        ad
      end
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

  after_create_commit do
    broadcast_replace_to [user, :short_address], target: "#{dom_id(user)}_short_address", partial: "addresses/short_address", locals: {address: self}
    broadcast_replace_to [user, :address], target: "#{dom_id(user)}_address", partial: "addresses/address", locals: {address: self}
  end

  after_update_commit do
    broadcast_replace_to [self, :short_address], partial: "addresses/short_address", locals: {address: self}, target: "#{dom_id(self)}_short_address"
    broadcast_replace_to self
  end
end
