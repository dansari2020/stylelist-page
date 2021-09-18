require "rails_helper"

RSpec.describe ActiveStorage::Blob, regressor: true do
  # === Relations ===

  it { is_expected.to have_one :preview_image_attachment }
  it { is_expected.to have_one :preview_image_blob }
  it { is_expected.to have_many :variant_records }
  it { is_expected.to have_many :attachments }

  # === Nested Attributes ===

  # === Database (Columns) ===
  it { is_expected.to have_db_column :id }
  it { is_expected.to have_db_column :key }
  it { is_expected.to have_db_column :filename }
  it { is_expected.to have_db_column :content_type }
  it { is_expected.to have_db_column :metadata }
  it { is_expected.to have_db_column :service_name }
  it { is_expected.to have_db_column :byte_size }
  it { is_expected.to have_db_column :checksum }
  it { is_expected.to have_db_column :created_at }

  # === Database (Indexes) ===
  it { is_expected.to have_db_index ["key"] }

  # === Validations (Length) ===

  # === Validations (Presence) ===
  it { is_expected.to validate_presence_of :service_name }

  # === Validations (Numericality) ===

  # === Enums ===
end
