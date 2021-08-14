class AddressesController < ApplicationController
  include ActionView::RecordIdentifier
  before_action :authenticate_user!
  before_action :set_address

  def new
    render turbo_stream: turbo_stream.replace("#{dom_id(current_user)}_address",
      partial: "form",
      locals: {address: @address, user: current_user})
  end

  def create
    respond_to do |format|
      @address = Address.create(address_params.merge(user_id: current_user.id))
      if @address
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(dom_id(@address),
            partial: "addresses/address",
            locals: {user: current_user, address: @address})
        end
      end
    end
  end

  def show
  end

  def edit
  end

  def update
    respond_to do |format|
      if @address.update(address_params)
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(dom_id(@address),
            partial: "addresses/address",
            locals: {user: current_user, address: @address})
        end
      end
    end
  end

  private

  def set_address
    @address = if params[:id].blank?
      current_user.build_address
    else
      Address.find_by!(id: params[:id], user: current_user)
    end
  end

  def address_params
    params.require(:address).permit(:country_code, :salon_name, :street, :unit_suit, :city, :province,
      :postal, :privacy)
  end
end
