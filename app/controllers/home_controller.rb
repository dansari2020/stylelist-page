class HomeController < ApplicationController
  before_action :authenticate_duck
  def index
  end
end
