class AddRegisterStepToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :register_step, :integer, default: 0
  end
end
