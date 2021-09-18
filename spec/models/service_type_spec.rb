require "rails_helper"

RSpec.describe ServiceType, regressor: true do
  # === Relations ===
  it { is_expected.to belong_to :portfolio }

  # === Nested Attributes ===

  # === Database (Columns) ===
  it { is_expected.to have_db_column :id }
  it { is_expected.to have_db_column :portfolio_id }
  it { is_expected.to have_db_column :name }
  it { is_expected.to have_db_column :created_at }
  it { is_expected.to have_db_column :updated_at }

  # === Database (Indexes) ===
  it { is_expected.to have_db_index ["portfolio_id"] }

  # === Validations (Length) ===

  # === Validations (Presence) ===
  it { is_expected.to validate_presence_of :portfolio }

  # === Validations (Numericality) ===

  # === Enums ===
end
