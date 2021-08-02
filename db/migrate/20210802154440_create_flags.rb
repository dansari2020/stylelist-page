class CreateFlags < ActiveRecord::Migration[6.1]
  def change
    create_table :flags do |t|
      t.belongs_to :portfolio, null: false, foreign_key: true
      t.integer :user_id

      t.timestamps
    end
  end
end
