class AddStaticUrlImageToPortfolios < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :image_url_type, :integer, default: 0
    add_column :users, :static_avatar_url, :string
    add_column :users, :static_background_url, :string
    add_column :portfolios, :image_url_type, :integer, default: 0
    add_column :portfolios, :static_image_url, :string
  end
end
