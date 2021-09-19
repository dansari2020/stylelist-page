require "rails_helper"

RSpec.describe SocialMedium, regressor: true do
  let(:kind) { SocialMedium.kinds.keys.sample }
  let(:url) { Faker::Name.first_name.downcase }

  # === Relations ===
  it { is_expected.to belong_to :user }

  # === Nested Attributes ===

  # === Database (Columns) ===
  it { is_expected.to have_db_column :id }
  it { is_expected.to have_db_column :user_id }
  it { is_expected.to have_db_column :kind }
  it { is_expected.to have_db_column :url }
  it { is_expected.to have_db_column :created_at }
  it { is_expected.to have_db_column :updated_at }

  # === Database (Indexes) ===
  it { is_expected.to have_db_index ["user_id"] }

  # === Validations (Length) ===

  # === Validations (Presence) ===
  it { is_expected.to validate_presence_of :kind }
  it { is_expected.to validate_presence_of :user }

  # === Validations (Numericality) ===

  # === Enums ===
  it { is_expected.to define_enum_for(:kind).with_values(["twitter", "facebook", "instagram", "youtube"]) }

  # === public methods ===
  subject {
    described_class.new(kind: kind, url: url)
  }

  let(:address) do
    FactoryBot.create(:address)
  end

  let(:privacy_address) do
    FactoryBot.create(:address, privacy: true)
  end

  describe ".full_url" do
    it "get a full url" do
      expect(subject.full_url).to eq("https://#{kind}.com/#{url}")
    end
  end

  describe ".kind_text" do
    it "get social medium name in text" do
      expect(subject.kind_text).to eq(subject.kind.humanize)
    end
  end

  describe "#kind_list" do
    it "get list of social media" do
      expect(SocialMedium.kind_list).to eq([["Twitter", "twitter"], ["Facebook", "facebook"], ["Instagram", "instagram"], ["Youtube", "youtube"]])
    end
  end
end
