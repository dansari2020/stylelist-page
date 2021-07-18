class AddHairLengthToPortfolios < ActiveRecord::Migration[6.1]
  def change
    add_column :portfolios, :hair_length, :integer
  end
end
