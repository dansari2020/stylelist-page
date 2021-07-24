class AddHairTypeToPortfolios < ActiveRecord::Migration[6.1]
  def change
    add_column :portfolios, :hair_type, :integer
    drop_table(:hair_types, if_exists: true)
  end
end
