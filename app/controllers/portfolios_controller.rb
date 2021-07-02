class PortfoliosController < ApplicationController
  before_action :authenticate_user!
  before_action :portfolio, only: %i[edit update destroy]

  def index
  end

  def new
    @portfolio = Portfolio.new
  end

  def create
    @portfolio = Portfolio.create!(user: current_user)
    upload_pictures
    redirect_to edit_portfolio_path(@portfolio)
  end

  def edit
  end

  def update
    if @portfolio.update(portfolio_params)
      upload_pictures
      redirect_to root_url
    end
  end

  def destroy
    @portfolio.destroy
  end

  private

  def portfolio
    @portfolio ||= Portfolio.find(params[:id])
  end

  def portfolio_params
    params.require(:portfolio).permit(:description, service_types_attributes: [:name], hair_types_attributes: [:name])
  end

  def upload_pictures
    @portfolio.pictures.attach(params[:portfolio][:pictures]) if params[:portfolio][:pictures].present?
  end
end
