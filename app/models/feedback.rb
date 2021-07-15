class Feedback < ApplicationRecord
  belongs_to :user

  validates :subject, presence: true
  validates :description, presence: true

  after_commit :send_email

  def send_email
    FeedbackMailer.with(feedback: self).feedback_email.deliver_later
  end
end
