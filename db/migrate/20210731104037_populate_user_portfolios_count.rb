class PopulateUserPortfoliosCount < ActiveRecord::Migration[6.1]
  def up
    User.find_each do |user|
      user.update_portfolios_count
    end
  end
end
