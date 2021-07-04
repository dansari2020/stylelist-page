class AddOpenedToAvailabilities < ActiveRecord::Migration[6.1]
  def change
    add_column :availabilities, :opened, :boolean, default: false
  end
end
