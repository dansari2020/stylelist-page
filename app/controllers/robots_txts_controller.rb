class RobotsTxtsController < ApplicationController
  def show
    render "disallow_all", layout: false, content_type: "text/plain"
  end
end
