class Language < ApplicationRecord
  has_and_belongs_to_many :users
  scope :primary, -> { where(primary: true) }
  scope :secondary, -> { where(primary: false) }
end
