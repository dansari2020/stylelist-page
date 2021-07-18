class Portfolio < ApplicationRecord
  enum status: %i[draft published]
  enum hair_length: %i[clipper ear chin shoulder armpit mid_back taillbone]

  belongs_to :user
  has_many :service_types, dependent: :destroy
  has_many :hair_types, dependent: :destroy
  has_many_attached :pictures
  accepts_nested_attributes_for :service_types, :hair_types, allow_destroy: true

  def self.hair_length_list
    hair_lengths.keys.map { |g| [g.humanize, g] }
  end
end
