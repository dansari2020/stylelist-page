require "rails_helper"

RSpec.describe Portfolio, regressor: true do
  # === Relations ===
  it { is_expected.to belong_to :user }

  it { is_expected.to have_many :flags }
  it { is_expected.to have_many :service_types }
  it { is_expected.to have_many :pictures_attachments }
  it { is_expected.to have_many :pictures_blobs }

  # === Nested Attributes ===
  it { is_expected.to accept_nested_attributes_for :service_types }

  # === Database (Columns) ===
  it { is_expected.to have_db_column :id }
  it { is_expected.to have_db_column :user_id }
  it { is_expected.to have_db_column :description }
  it { is_expected.to have_db_column :created_at }
  it { is_expected.to have_db_column :updated_at }
  it { is_expected.to have_db_column :status }
  it { is_expected.to have_db_column :hair_length }
  it { is_expected.to have_db_column :hair_type }
  it { is_expected.to have_db_column :flags_count }

  # === Database (Indexes) ===
  it { is_expected.to have_db_index ["user_id"] }

  # === Validations (Length) ===

  # === Validations (Presence) ===
  it { is_expected.to validate_presence_of :user }

  # === Validations (Numericality) ===

  # === Enums ===
  it { is_expected.to define_enum_for(:status).with_values(["draft", "published"]) }
  it { is_expected.to define_enum_for(:hair_length).with_values(["clipper", "ear", "chin", "shoulder", "armpit", "mid_back", "taillbone"]) }
  it { is_expected.to define_enum_for(:hair_type).with_values(["straight", "wavy", "curly", "afro"]) }
end
