class AddAmpmToAvailabilities < ActiveRecord::Migration[6.1]
  def change
    add_column :availabilities, :open_at_ampm, :integer, default: 0
    add_column :availabilities, :close_at_ampm, :integer, default: 0
  end
end
