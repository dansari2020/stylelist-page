class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch("MAILER_SENDER", "support@stylelistpage.com")
  layout "mailer"
end
