class FlagsController < ApplicationController
  def create
    @flag = Flag.create(flag_prams)
    respond_to do |format|
      format.html do
        redirect_back fallback_location: root_path
      end
      format.js
      format.json
    end
  end

  private

  def flag_prams
    params.permit(:portfolio_id, :user_id)
  end
end
