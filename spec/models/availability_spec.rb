require "rails_helper"

RSpec.describe Availability, regressor: true do
  # === Relations ===
  it { is_expected.to belong_to :user }

  # === Nested Attributes ===

  # === Database (Columns) ===
  it { is_expected.to have_db_column :id }
  it { is_expected.to have_db_column :user_id }
  it { is_expected.to have_db_column :day }
  it { is_expected.to have_db_column :open_at }
  it { is_expected.to have_db_column :close_at }
  it { is_expected.to have_db_column :created_at }
  it { is_expected.to have_db_column :updated_at }
  it { is_expected.to have_db_column :opened }

  # === Database (Indexes) ===
  it { is_expected.to have_db_index ["user_id"] }

  # === Validations (Length) ===

  # === Validations (Presence) ===
  it { is_expected.to validate_presence_of :user }
  it { is_expected.to validate_presence_of :day }

  # === Validations (Numericality) ===

  # === Enums ===
  it { is_expected.to define_enum_for(:day).with_values(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]) }
end
