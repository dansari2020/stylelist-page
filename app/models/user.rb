class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :validatable,
    :registerable, :timeoutable, :confirmable

  enum role: %w[client hair_stylist barber admin]

  has_one_attached :avatar

  validates :username, allow_blank: true, uniqueness: {case_sensitive: false}
  validates :email, presence: true, uniqueness: {case_sensitive: false}
  validates :password, presence: true, confirmation: true, length: {minimum: 8}, on: :create

  def full_name
    [first_name, last_name].compact.join(" ")
  end

  protected

  def timeout_in
    1.hour
  end

  def confirmation_required?
    false
  end
end
