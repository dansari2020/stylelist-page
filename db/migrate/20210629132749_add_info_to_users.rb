class AddInfoToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :bio, :text
    add_column :users, :started_at, :date
    add_column :users, :education, :string
    add_column :users, :phone, :string
  end
end
