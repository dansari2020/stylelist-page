class Availability < ApplicationRecord
  belongs_to :user

  validates :day, presence: true

  before_validation :reset_time

  def reset_time
    if !opened?
      self.open_at = nil
      self.close_at = nil
      self.opened = false
    end
  end

  def day_name
    Date::DAYNAMES[day].capitalize
  end

  def info
    "#{day_name} #{working_hours}"
  end

  def working_hours
    if opened?
      "#{open_at&.strftime("%I:%M %p")} - #{close_at&.strftime("%I:%M %p")}"
    else
      "Not Available"
    end
  end
end
