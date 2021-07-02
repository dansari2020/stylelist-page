class Portfolio < ApplicationRecord
  enum status: %i[draft published]

  belongs_to :user
  has_many :service_types, dependent: :destroy
  has_many :hair_types, dependent: :destroy
  has_many_attached :pictures
  accepts_nested_attributes_for :service_types, :hair_types, allow_destroy: true
end
