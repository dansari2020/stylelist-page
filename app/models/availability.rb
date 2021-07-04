class Availability < ApplicationRecord
  belongs_to :user

  validates :day, presence: true

  before_validation :reset_time

  def reset_time
    if !opened?
      self.open_at = nil
      self.close_at = nil
    end
  end
end
