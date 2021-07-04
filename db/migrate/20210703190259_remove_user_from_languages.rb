class RemoveUserFromLanguages < ActiveRecord::Migration[6.1]
  def change
    remove_belongs_to :languages, :user
  end
end
