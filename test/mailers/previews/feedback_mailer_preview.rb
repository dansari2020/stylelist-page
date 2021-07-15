# Preview all emails at http://localhost:3000/rails/mailers/feedback_mailer
class FeedbackMailerPreview < ActionMailer::Preview
  # Preview this email at http://localhost:3000/rails/mailers/feedback_mailer/feedback_email
  def feedback_email
    feedback = User.all.sample.feedbacks.new(subject: "Feedback about upload image",
      description: "Hey,\r\nI hope You are doing well.\r\nI have a question that is how can i upload image?\r\n Bests,")
    FeedbackMailer.with(feedback: feedback).feedback_email
  end
end
