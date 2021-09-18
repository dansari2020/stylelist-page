class Flag < ApplicationRecord
  belongs_to :portfolio, counter_cache: true

  validates :portfolio, presence: true

  after_create :update_flags_count
  after_destroy :update_flags_count

  private

  def update_flags_count
    portfolio.user.update_flags_count
  end
end
