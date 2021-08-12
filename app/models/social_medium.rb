class SocialMedium < ApplicationRecord
  enum kind: %i[twitter facebook instagram youtube]

  validates :kind, presence: true
  # validates :url, presence: true

  belongs_to :user

  def full_url
    "https://#{kind}.com/#{url}"
  end

  def self.kind_list
    kinds.keys.map { |g| [g.humanize, g] }
  end

  def kind_text
    kind.humanize
  end
end
