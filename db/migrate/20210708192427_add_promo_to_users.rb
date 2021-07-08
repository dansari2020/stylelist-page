class AddPromoToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :client_incentives, :string
    add_column :users, :condition_for_incenrive, :string
  end
end
