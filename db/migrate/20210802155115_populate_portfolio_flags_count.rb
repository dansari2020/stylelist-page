class PopulatePortfolioFlagsCount < ActiveRecord::Migration[6.1]
  def change
    add_column :portfolios, :flags_count, :integer, null: false, default: 0
    add_column :users, :flags_count, :integer, null: false, default: 0
  end
end
