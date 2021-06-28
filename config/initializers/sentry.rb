if Rails.env.production?
  Sentry.init do |config|
    config.dsn = ENV["SENTRY_DSN"]
    config.environment = "Staging"
    config.background_worker_threads = 0
    config.send_default_pii = true
    config.traces_sample_rate = 1.0
    config.breadcrumbs_logger = [:active_support_logger, :http_logger]
  end
end
