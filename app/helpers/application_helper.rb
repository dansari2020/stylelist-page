module ApplicationHelper
  def alert_class_for(flash_type)
    {
      success: "alert-success",
      error: "alert-danger",
      alert: "alert-warning",
      notice: "alert-info"
    }.stringify_keys[flash_type.to_s] || flash_type.to_s
  end

  def thumb_url(image)
    image.variant(gravity: "center", auto_orient: true, rotate: 0, resize: "200x200^", crop: "200x200+0+0")
  end
end
