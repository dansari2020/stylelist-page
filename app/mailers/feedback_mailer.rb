class FeedbackMailer < ApplicationMailer
  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.feedback_mailer.feedback_email.subject
  #
  def feedback_email
    @feedback = params[:feedback]

    mail(to: ENV.fetch("FEEDBACK_MAIL", "StylistPage <hello@stylistpage.com>"),
      cc: ENV["FEEDBACK_CC_MAIL"],
      subject: "Got FeedBack #{@feedback.id}")
  end
end
