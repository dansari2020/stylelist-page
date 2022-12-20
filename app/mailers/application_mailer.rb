class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch("MAILER_SENDER", "Salon House <support@salonhouse.herokuapp.com>")
  layout "mailer"
end
