class AddDefualtToKindSocialMedia < ActiveRecord::Migration[6.1]
  def change
    change_column :social_media, :kind, :integer, default: 0, null: false
  end
end
