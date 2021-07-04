class AddPhoneTypeToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :phone_type, :integer, default: 0
    add_column :users, :phone_method, :integer, default: 0
  end
end
