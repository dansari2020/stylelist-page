class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch("MAILER_SENDER", "support@stylelist.com")
  layout "mailer"
end
