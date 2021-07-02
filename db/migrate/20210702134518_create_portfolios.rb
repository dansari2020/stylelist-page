class CreatePortfolios < ActiveRecord::Migration[6.1]
  def change
    create_table :portfolios do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.text :description

      t.timestamps
    end
  end
end
