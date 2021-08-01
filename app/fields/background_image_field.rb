require "administrate/field/base"

class BackgroundImageField < Administrate::Field::Base
  def default_url
    "icons/background.svg"
  end

  def preview(attachment, options)
    Rails.application.routes.url_helpers.rails_representation_path(attachment.preview(options), only_path: true)
  end

  def variant(attachment, options)
    Rails.application.routes.url_helpers.rails_representation_url(attachment.variant(options).processed, only_path: true)
  end

  def url(attachment)
    Rails.application.routes.url_helpers.rails_blob_path(attachment, only_path: true)
  end

  def blob_url(attachment)
    Rails.application.routes.url_helpers.rails_blob_path(attachment, disposition: :attachment, only_path: true)
  end

  def can_add_attachment?
    many? || attachments.blank?
  end

  def attached?
    data.is_a?(ActiveStorage::VariantWithRecord) || data.present? && (data.class.to_s.include?("ActiveStorage") && data.attached?)
  end

  def attachments
    if attached?
      many? ? data.attachments : [data.attachment]
    end
  end
end
