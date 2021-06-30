class AddDeactiveReasonToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :deactivate_reason, :integer, default: 0
    add_column :users, :deactivate_description, :text
  end
end
