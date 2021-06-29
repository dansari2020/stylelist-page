class CreateSocialMedia < ActiveRecord::Migration[6.1]
  def change
    create_table :social_media do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.integer :kind
      t.string :url

      t.timestamps
    end
  end
end
