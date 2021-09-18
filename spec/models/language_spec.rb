require "rails_helper"

RSpec.describe Language, regressor: true do
  # === Relations ===

  # === Nested Attributes ===

  # === Database (Columns) ===
  it { is_expected.to have_db_column :id }
  it { is_expected.to have_db_column :name }
  it { is_expected.to have_db_column :created_at }
  it { is_expected.to have_db_column :updated_at }
  it { is_expected.to have_db_column :primary }

  # === Database (Indexes) ===

  # === Validations (Length) ===

  # === Validations (Presence) ===

  # === Validations (Numericality) ===

  # === Enums ===
end
