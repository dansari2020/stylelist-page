class Portfolio < ApplicationRecord
  enum status: %i[draft published]
  enum hair_length: %i[clipper ear chin shoulder armpit mid_back taillbone]
  enum hair_type: %i[straight wavy curly afro]
  enum image_url_type: %i[file url]

  belongs_to :user
  has_many :flags, dependent: :destroy
  has_many :service_types, dependent: :destroy
  has_many_attached :pictures
  accepts_nested_attributes_for :service_types, allow_destroy: true

  validates :user, presence: true

  delegate :first_name, to: :user, prefix: true

  after_save :update_counter_cache
  after_destroy :update_counter_cache

  def self.hair_length_list
    hair_lengths.keys.map { |g| [g.humanize, g] }
  end

  def self.hair_type_list
    hair_types.keys.map { |g| [g.humanize, g] }
  end

  def picture
    pictures.first if pictures.attached?
  end

  def url
    [user.url, "porfolios", id].join("/").gsub("https://https://", "https://")
  end

  def self.prefer_service_types
    %w[Cut Color Style]
  end

  def next
    @next ||= user.portfolios.published.order(created_at: :desc).where("id > ?", id).last
  end

  def prev
    @prev ||= user.portfolios.published.order(created_at: :desc).where("id < ?", id).first
  end

  private

  def update_counter_cache
    user.update_portfolios_count
  end
end
