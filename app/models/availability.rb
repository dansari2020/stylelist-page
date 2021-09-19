class Availability < ApplicationRecord
  belongs_to :user

  enum day: %i[Sunday Monday Tuesday Wednesday Thursday Friday Saturday]

  validates :day, presence: true
  validates :user, presence: true

  validate :check_working_hours

  before_validation :reset_time

  def reset_time
    if !opened?
      self.open_at = nil
      self.close_at = nil
    end
  end

  def open_at_in_text
    read_attribute(:open_at).strftime("%I:%M %P") if read_attribute(:open_at).present?
  end

  def close_at_in_text
    read_attribute(:close_at).strftime("%I:%M %P") if read_attribute(:close_at).present?
  end

  def open_at
    in_12_hours(read_attribute(:open_at)) if read_attribute(:open_at).present?
  end

  def close_at
    in_12_hours(read_attribute(:close_at)) if read_attribute(:close_at).present?
  end

  def in_12_hours(time)
    if time.strftime("%P") == "pm"
      time - 12.hours
    else
      time
    end
  end

  def open_at=(new_open_at)
    if new_open_at.present?
      res = DateTime.strptime(new_open_at, "%H:%M %p")
      self[:open_at] = res
    else
      self[:open_at] = nil
    end
  end

  def close_at=(new_close_at)
    if new_close_at.present?
      res = DateTime.strptime(new_close_at, "%H:%M %p")
      self[:close_at] = res
    else
      self[:close_at] = nil
    end
  end

  def info
    "#{day} #{working_hours}"
  end

  def working_hours
    if opened?
      "#{self[:open_at]&.strftime("%I:%M %p")} - #{self[:close_at]&.strftime("%I:%M %p")}"
    else
      "Not Available"
    end
  end

  def check_working_hours
    if opened?
      if open_at.nil? || close_at.nil?
        errors.add(:opening_time, " or closing time can't be blank")
      elsif read_attribute(:close_at) < read_attribute(:open_at)
        errors.add :closing_time, "must be after opening time"
      end
    end
  end
end
