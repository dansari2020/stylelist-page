class AddPronounToUsers < ActiveRecord::Migration[6.1]
  def change
    remove_column :users, :gender
    add_column :users, :pronoun, :string
  end
end
