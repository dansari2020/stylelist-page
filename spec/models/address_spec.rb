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

  # === public methods ===
  subject {
    described_class.new(country_code: "US")
  }

  let(:address) do
    FactoryBot.create(:address)
  end

  let(:privacy_address) do
    FactoryBot.create(:address, privacy: true)
  end

  describe ".country" do
    it "get a country name by code" do
      expect(subject.country.name).to eq("United States of America")
    end
  end

  describe ".full_address" do
    it "get empty array of new address" do
      expect(subject.full_address).to be_empty
    end

    it "get full address" do
      expect(address.full_address.join(", ")).to eq([
        address.salon_name, address.street, address.unit_suit, address.city, address.province, address.postal, address.country.name
      ].join(", "))
    end

    it "dont return privacy address" do
      expect(privacy_address.full_address).to eq(["Your address has been hidden"])
    end
  end
end
