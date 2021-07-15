class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :validatable,
    :registerable, :timeoutable, :confirmable

  enum role: %i[client hair_stylist barber admin]
  enum status: %i[pending completed deactivated]
  enum phone_type: %i[mobile salon]
  enum phone_method: %i[text_or_calls text calls]
  enum deactivate_reason: {"Select a reason (optional)": 0,
                           "This is temporary. I'll be back": 1,
                           "My account was hacked": 2,
                           "I don't find StylistPage useful": 3,
                           "I have privacy concerns": 4,
                           "I don't understand how to use StylistPage": 5,
                           "I don't do hair anymore": 6}
  validates :username, uniqueness: {allow_blank: true, case_sensitive: false}
  validates :email, presence: true, uniqueness: {case_sensitive: false}
  validates :password, presence: true, confirmation: true, length: {minimum: 8}, on: :create
  validates :first_name, presence: true
  validates :last_name, presence: true

  has_one_attached :avatar
  has_one_attached :background

  has_one :address, dependent: :destroy
  has_many :specialties, dependent: :destroy
  has_many :services, dependent: :destroy
  has_many :availabilities, dependent: :destroy
  has_many :social_media, dependent: :destroy
  has_many :portfolios, dependent: :destroy
  has_many :pictures, through: :portfolios
  accepts_nested_attributes_for :specialties, :address, :services,
    :availabilities, :social_media, allow_destroy: true
  has_and_belongs_to_many :languages, dependent: :destroy

  before_save :destroy_prvious_data
  after_update :send_confirmation_instructions, if: :should_send_confirmation

  delegate :full_address, :salon_name, :short_address, to: :address, allow_nil: true

  def full_name
    [first_name, last_name].compact.join(" ")
  end

  def url
    [ENV.fetch("WEBSITE_URL", "stylistpage.com/").strip, username.strip].compact.join
  end

  def profile_completed?
    username.present? && completed?
  end

  ["bio", "username", "social_media", "education", "started_at", "specialties", "services",
    "social_media", "phone", "languages", "full_address"].each do |info|
    define_method("has_#{info}?") do
      send(info).present?
    end
  end

  def self.phone_type_list
    phone_types.keys.map { |g| [g.humanize, g] }
  end

  def self.phone_method_list
    phone_methods.keys.map { |g| [g.humanize, g] }
  end

  def job
    role.humanize.gsub("stylist", "Stylist")
  end

  def avatar_thumb
    avatar.variant(gravity: "center", auto_orient: true, rotate: 0, resize: "112x112^", crop: "112x112+0+0")
  end

  def backgroun_medium
    background.variant(gravity: "center", auto_orient: true, rotate: 0, resize: "530x200^", crop: "530x200+0+0")
  end

  def distance_of_time_at_now
    time_diff_in_natural_language(started_at, Time.now)
  end

  def time_diff_in_natural_language(from_time, to_time)
    from_time = from_time.to_time if from_time.respond_to?(:to_time)
    to_time = to_time.to_time if to_time.respond_to?(:to_time)
    distance_in_seconds = (to_time - from_time).abs.round
    components = []

    %w[year month].each do |interval|
      if distance_in_seconds >= 1.send(interval)
        delta = (distance_in_seconds / 1.send(interval)).floor
        distance_in_seconds -= delta.send(interval)
        components << "#{delta} #{interval.pluralize(delta).capitalize}"
      end
    end

    components.join(", ")
  end

  # def active_for_authentication?
  #   super && !deactivated?
  # end

  # def inactive_message
  #   !deactivated? ? super : :deactivated_account
  # end

  def has_availabilities?
    @has_availabilities ||= availabilities.pluck(:opened).any?
  end

  def should_send_confirmation
    !confirmed? && completed? && confirmation_token.nil?
  end

  protected

  def timeout_in
    # 1.hour
  end

  def confirmation_required?
    false
  end

  def destroy_prvious_data
    # Specialty.where(user_id: id).destroy_all if specialties.any? { |s| s.name_changed? }
    Service.where(user_id: id).destroy_all if services.any? { |s| s.name_changed? }
  end
end
