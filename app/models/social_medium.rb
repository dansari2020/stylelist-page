class SocialMedium < ApplicationRecord
  belongs_to :user

  enum kind: %i[twitter facebook instagram youtube]

  validates :kind, presence: true
  validates :user, presence: true

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
