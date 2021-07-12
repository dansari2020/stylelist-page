class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch("MAILER_SENDER", "support@stylistpage.com")
  layout "mailer"
end
