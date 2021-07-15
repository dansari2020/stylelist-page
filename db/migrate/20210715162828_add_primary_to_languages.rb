class AddPrimaryToLanguages < ActiveRecord::Migration[6.1]
  def change
    add_column :languages, :primary, :boolean, default: false
  end
end
