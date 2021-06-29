class CreateAddresses < ActiveRecord::Migration[6.1]
  def change
    create_table :addresses do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.string :street
      t.string :postal
      t.string :province
      t.string :country

      t.timestamps
    end
  end
end
