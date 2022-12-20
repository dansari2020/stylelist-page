require "rails_helper"

RSpec.describe User, regressor: true do
  # === Relations ===

  it { is_expected.to have_one :avatar_attachment }
  it { is_expected.to have_one :avatar_blob }
  it { is_expected.to have_one :background_attachment }
  it { is_expected.to have_one :background_blob }
  it { is_expected.to have_one :address }
  it { is_expected.to have_many :specialties }
  it { is_expected.to have_many :services }
  it { is_expected.to have_many :availabilities }
  it { is_expected.to have_many :social_media }
  it { is_expected.to have_many :portfolios }
  it { is_expected.to have_many :flags }
  it { is_expected.to have_many(:pictures).through(:portfolios) }

  # === Nested Attributes ===
  it { is_expected.to accept_nested_attributes_for :specialties }
  it { is_expected.to accept_nested_attributes_for :address }
  it { is_expected.to accept_nested_attributes_for :services }
  it { is_expected.to accept_nested_attributes_for :availabilities }
  it { is_expected.to accept_nested_attributes_for :social_media }

  # === Database (Columns) ===
  it { is_expected.to have_db_column :id }
  it { is_expected.to have_db_column :first_name }
  it { is_expected.to have_db_column :last_name }
  it { is_expected.to have_db_column :username }
  it { is_expected.to have_db_column :email }
  it { is_expected.to have_db_column :encrypted_password }
  it { is_expected.to have_db_column :role }
  it { is_expected.to have_db_column :reset_password_token }
  it { is_expected.to have_db_column :reset_password_sent_at }
  it { is_expected.to have_db_column :remember_created_at }
  it { is_expected.to have_db_column :confirmation_token }
  it { is_expected.to have_db_column :confirmed_at }
  it { is_expected.to have_db_column :confirmation_sent_at }
  it { is_expected.to have_db_column :unconfirmed_email }
  it { is_expected.to have_db_column :created_at }
  it { is_expected.to have_db_column :updated_at }
  it { is_expected.to have_db_column :status }
  it { is_expected.to have_db_column :bio }
  it { is_expected.to have_db_column :started_at }
  it { is_expected.to have_db_column :education }
  it { is_expected.to have_db_column :phone }
  it { is_expected.to have_db_column :deactivate_reason }
  it { is_expected.to have_db_column :deactivate_description }
  it { is_expected.to have_db_column :phone_type }
  it { is_expected.to have_db_column :phone_method }
  it { is_expected.to have_db_column :pronoun }
  it { is_expected.to have_db_column :client_incentives }
  it { is_expected.to have_db_column :condition_for_incenrive }
  it { is_expected.to have_db_column :portfolios_count }
  it { is_expected.to have_db_column :flags_count }

  # === Database (Indexes) ===
  it { is_expected.to have_db_index ["email"] }
  it { is_expected.to have_db_index ["reset_password_token"] }

  # === Validations (Length) ===

  # === Validations (Presence) ===
  context "with conditions" do
    before do
      allow(subject).to receive(:email_required?).and_return(true)
    end

    it { is_expected.to validate_presence_of :email }
  end

  it { is_expected.to validate_presence_of :email }
  context "with conditions" do
    before do
      allow(subject).to receive(:password_required?).and_return(true)
    end

    it { is_expected.to validate_presence_of :password }
  end

  it { is_expected.to validate_presence_of :password }
  it { is_expected.to validate_presence_of :first_name }
  it { is_expected.to validate_presence_of :last_name }

  # === Validations (Numericality) ===

  # === Enums ===
  it { is_expected.to define_enum_for(:role).with_values(["client", "hair_stylist", "barber", "admin"]) }
  it { is_expected.to define_enum_for(:status).with_values(["pending", "activated", "deactivated", "disabled"]) }
  it { is_expected.to define_enum_for(:phone_type).with_values(["mobile", "salon"]) }
  it { is_expected.to define_enum_for(:phone_method).with_values(["text_or_calls", "text", "calls"]) }
  it { is_expected.to define_enum_for(:deactivate_reason).with_values(["Select a reason (optional)", "This is temporary. I'll be back", "My account was hacked", "I don't find Salon House useful", "I have privacy concerns", "I don't understand how to use Salon House", "I don't do hair anymore"]) }
end
