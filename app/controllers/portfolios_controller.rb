class PortfoliosController < ApplicationController
  before_action :authenticate_duck!, only: %i[edit update destroy]
  before_action :portfolio, only: %i[edit show update destroy]
  before_action :editable, only: %i[edit show update destroy]

  def index
  end

  def new
    @portfolio = Portfolio.new
  end

  def create
    @portfolio = Portfolio.create!(user: current_user)
    upload_pictures
    respond_to do |format|
      format.html do
        redirect_to edit_portfolio_path(@portfolio)
      end
      format.json { render json: {location: edit_portfolio_path(@portfolio)} }
    end
  end

  def show
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace("portfolioPopup", partial: "portfolios/portfolio", locals: {portfolio: @portfolio})
      end
      format.html do
        render "portfolios/show"
      end
      format.json do
        render json: @portfolio
      end
      format.js
    end
  end

  def edit
    respond_to do |format|
      format.html
      format.js
    end
  end

  def update
    respond_to do |format|
      if @portfolio.update(portfolio_params.merge(status: :published))
        upload_pictures
        format.js
        format.html do
          if params[:commit] == "Save and add another photo"
            redirect_to new_portfolio_path
          else
            redirect_to root_url
          end
        end
      end
    end
  end

  def destroy
    @portfolio.destroy
    flash[:destroy_pictures_msg] = "1 Photo Deleted"
    respond_to do |format|
      format.html { redirect_to root_url }
    end
  end

  def destroy_pictures
    Array.wrap(params[:pictures_ids]).each do |id|
      picture = ActiveStorage::Attachment.find_by(id: id)
      portfolio = picture.record
      picture&.delete
      portfolio.destroy if portfolio.pictures.empty?
    end
    flash[:destroy_pictures_msg] = "#{params[:pictures_ids].size} #{"Photo".pluralize(params[:pictures_ids].size)} Deleted"
    redirect_to root_url
  end

  private

  def portfolio
    @portfolio ||= Portfolio.find(params[:id])
  end

  def portfolio_params
    params.require(:portfolio).permit(:description, :hair_length, :hair_type,
      service_types_attributes: [:id, :name, :_destroy])
  end

  def upload_pictures
    if params.dig(:portfolio, :pictures).present?
      Array.wrap(params[:portfolio][:pictures]).each do |image|
        if image.is_a?(ActionDispatch::Http::UploadedFile)
          @portfolio.pictures.attach(image)
        else
          image.values.each do |img|
            if img.is_a?(ActionDispatch::Http::UploadedFile)
              @portfolio.pictures.attach(img)
            end
          end
        end
      end
    end
  end

  def editable
    @editable = current_user.present? && current_user == @portfolio.user
  end
end
