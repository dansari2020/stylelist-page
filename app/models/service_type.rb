class ServiceType < ApplicationRecord
  belongs_to :portfolio
  validates :portfolio, presence: true
end
