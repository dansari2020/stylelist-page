Rails.application.config.active_storage.previewers << HeicPreviewer
Rails.application.config.active_storage.previewers << "image/heic"
Rails.application.config.active_storage.previewers << "image/heif"