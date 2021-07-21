module ApplicationHelper
  def alert_class_for(flash_type)
    {
      success: "alert-success",
      error: "alert-danger",
      alert: "alert-warning",
      notice: "alert-info"
    }.stringify_keys[flash_type.to_s] || flash_type.to_s
  end

  def thumb_url(image, resize = "200x200^", crop = "200x200+0+0")
    return if image.nil?

    image.variant(gravity: "center", auto_orient: true, rotate: 0, resize: resize, crop: crop)
  end

  def picture_only_url(image, resize = "499x499^", crop = "499x499+0+0")
    Rails.application.routes.url_helpers.rails_representation_url(thumb_url(image, resize, crop).processed, only_path: true)
  end

  def picture_url(image, resize = "499x499^", crop = "499x499+0+0")
    thumb_url(image, resize, crop)
  end

  def default_avatar
    image_url("icons/avatar.svg")
  end
end
