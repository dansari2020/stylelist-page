class Portfolio < ApplicationRecord
  enum status: %i[draft published]
  enum hair_length: %i[clipper ear chin shoulder armpit mid_back taillbone]
  enum hair_type: %i[straight wavy curly afro]

  belongs_to :user
  has_many :service_types, dependent: :destroy
  has_many_attached :pictures
  accepts_nested_attributes_for :service_types, allow_destroy: true

  delegate :first_name, to: :user, prefix: true

  def self.hair_length_list
    hair_lengths.keys.map { |g| [g.humanize, g] }
  end

  def picture
    pictures.first if pictures.attached?
  end

  def url
    [user.url, "porfolios", id].join("/")
  end

  def self.prefer_service_types
    %w[Cut Color Style]
  end
end
