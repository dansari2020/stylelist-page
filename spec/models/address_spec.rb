require "rails_helper"

RSpec.describe Address, regressor: true do
  # === Relations ===
  it { is_expected.to belong_to :user }

  # === Nested Attributes ===

  # === Database (Columns) ===
  it { is_expected.to have_db_column :id }
  it { is_expected.to have_db_column :user_id }
  it { is_expected.to have_db_column :street }
  it { is_expected.to have_db_column :postal }
  it { is_expected.to have_db_column :province }
  it { is_expected.to have_db_column :country_code }
  it { is_expected.to have_db_column :created_at }
  it { is_expected.to have_db_column :updated_at }
  it { is_expected.to have_db_column :salon_name }
  it { is_expected.to have_db_column :unit_suit }
  it { is_expected.to have_db_column :city }
  it { is_expected.to have_db_column :privacy }

  # === Database (Indexes) ===
  it { is_expected.to have_db_index ["user_id"] }

  # === Validations (Length) ===

  # === Validations (Presence) ===
  it { is_expected.to validate_presence_of :user }

  # === Validations (Numericality) ===

  # === Enums ===
end
