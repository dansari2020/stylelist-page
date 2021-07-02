class CreateServiceTypes < ActiveRecord::Migration[6.1]
  def change
    create_table :service_types do |t|
      t.belongs_to :portfolio, null: false, foreign_key: true
      t.string :name

      t.timestamps
    end
  end
end
