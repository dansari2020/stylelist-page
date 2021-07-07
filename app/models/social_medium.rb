class SocialMedium < ApplicationRecord
  enum kind: %i[twitter facebook instagram youtube]

  validates :kind, presence: true
  # validates :url, presence: true

  belongs_to :user

  def full_url
    "https://#{kind}.com/#{url}"
  end
end
