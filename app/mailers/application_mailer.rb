class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch("MAILER_SENDER", "StylistPage <support@stylistpage.com>")
  layout "mailer"
end
