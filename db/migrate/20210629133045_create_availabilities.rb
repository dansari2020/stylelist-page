class CreateAvailabilities < ActiveRecord::Migration[6.1]
  def change
    create_table :availabilities do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.integer :day
      t.time :open_at
      t.time :close_at

      t.timestamps
    end
  end
end
