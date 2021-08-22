class ErrorsController < ApplicationController
  layout :resolve_layout
  def not_found
    render status: 404
  end

  def internal_server_error
    render status: 500
  end

  def resolve_layout
    case action_name
    when "internal_server_error"
      "blank"
    else
      "application"
    end
  end
end
