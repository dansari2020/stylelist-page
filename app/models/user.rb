class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :validatable,
    :registerable, :timeoutable, :confirmable

  enum role: %w[client hair_stylist barber admin]
  enum status: %w[pending completed]

  validates :username, uniqueness: {allow_blank: true, case_sensitive: false}
  validates :email, presence: true, uniqueness: {case_sensitive: false}
  validates :password, presence: true, confirmation: true, length: {minimum: 8}, on: :create

  has_one_attached :avatar
  has_one_attached :background

  has_many :specialties, dependent: :destroy
  has_many :languages, dependent: :destroy
  has_many :address, dependent: :destroy
  has_many :services, dependent: :destroy
  has_many :availabilities, dependent: :destroy
  has_many :social_media, dependent: :destroy
  accepts_nested_attributes_for :specialties, allow_destroy: true
  accepts_nested_attributes_for :languages, allow_destroy: true
  accepts_nested_attributes_for :address, allow_destroy: true
  accepts_nested_attributes_for :services, allow_destroy: true
  accepts_nested_attributes_for :availabilities, allow_destroy: true
  accepts_nested_attributes_for :social_media, allow_destroy: true
  before_save :destroy_prvious_data

  def full_name
    [first_name, last_name].compact.join(" ")
  end

  def url
    [ENV.fetch("WEBSITE_URL", "stylistpage.com/"), username].compact.join(" ")
  end

  def profile_completed?
    username.present? && completed?
  end

  ["bio", "username", "social_media", "education", "started_at",
    "specialties", "services", "social_media"].each do |info|
    define_method("has_#{info}?") do
      send(info).present?
    end
  end

  protected

  def timeout_in
    1.hour
  end

  def confirmation_required?
    false
  end

  def destroy_prvious_data
    Specialty.where(user_id: id).destroy_all if specialties.any? { |s| s.name_changed? }
    Service.where(user_id: id).destroy_all if services.any? { |s| s.name_changed? }
  end
end
