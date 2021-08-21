class Availability < ApplicationRecord
  belongs_to :user

  enum open_at_ampm: %i[am pm], _prefix: true
  enum close_at_ampm: %i[am pm], _prefix: true
  validates :day, presence: true

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
      res = DateTime.strptime(new_open_at, "%H:%M")
      if res.strftime("%P") == "am" && open_at_ampm_pm?
        res += 12.hours
      elsif res.strftime("%P") == "pm" && open_at_ampm_am?
        res -= 12.hours
      end
      self[:open_at] = res
    end
  end

  def close_at=(new_close_at)
    if new_close_at.present?
      res = DateTime.strptime(new_close_at, "%H:%M")
      if res.strftime("%P") == "am" && close_at_ampm_pm?
        res += 12.hours
      elsif res.strftime("%P") == "pm" && close_at_ampm_am?
        res -= 12.hours
      end
      self[:close_at] = res
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

  def check_working_hours
    if opened?
      if open_at.nil? || close_at.nil?
        errors.add(:open_time, " or closing time can't be blank")
      elsif read_attribute(:close_at) < read_attribute(:open_at)
        errors.add :closing_time, "must be after open time"
      end
    end
  end
end
