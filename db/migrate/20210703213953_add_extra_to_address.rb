class AddExtraToAddress < ActiveRecord::Migration[6.1]
  def change
    add_column :addresses, :salon_name, :string
    add_column :addresses, :unit_suit, :string
    add_column :addresses, :city, :string
    add_column :addresses, :privacy, :boolean, default: false
    rename_column :addresses, :country, :country_code
  end
end
