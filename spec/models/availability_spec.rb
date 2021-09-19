require "rails_helper"

RSpec.describe Availability, regressor: true do
  let(:open) { Time.now.change(hour: 8) }
  let(:close) { Time.now.change(hour: 18) }
  let(:day) { Availability.days.keys.sample }

  subject {
    described_class.new(day: day, opened: true, open_at: open.strftime("%I:%M %P"), close_at: close.strftime("%I:%M %P"))
  }
  
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
  
  it "is not valid without a open_at" do
    expect(Availability.new(opened: true)).to_not be_valid
  end

  it "is not valid open_at after the close_at" do
    expect(Availability.new(opened: true, open_at: close.strftime("%I:%M %P"), close_at: open.strftime("%I:%M %P") )).to_not be_valid
  end

  # === Validations (Numericality) ===

  # === Enums ===
  it { is_expected.to define_enum_for(:day).with_values(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]) }
  
  # === public methods ===
  describe ".open_at_in_text" do
    it "get open at in text" do
      expect(subject.open_at_in_text).to eq(open.strftime("%I:%M %P"))
    end
  end

  describe ".close_at_in_text" do
    it "get close at in text" do
      expect(subject.close_at_in_text).to eq(close.strftime("%I:%M %P"))
    end
  end

  describe ".open_at" do
    it "returns open at in 12 hours" do
      expect(subject.open_at.hour).to eq(open.hour)
    end
  end

  describe ".close_at" do
    it "returns close at in 12 hour" do
      expect(subject.close_at.hour).to eq(close.hour - 12)
    end
  end

  describe ".info" do
    it "returns working hour in a format" do
      expect(subject.info).to eq("#{day} #{open.strftime("%I:%M %p")} - #{close.strftime("%I:%M %p")}")
    end
  end

  describe ".working_hours" do
    it "returns working hour is Not Available" do
      expect(described_class.new(opened: false).working_hours).to eq("Not Available")
    end
  end

  describe ".reset_time" do
    it "returns empty open_at and close_at" do
      tmp = described_class.new(opened: false, open_at: close.strftime("%I:%M %P"), close_at: open.strftime("%I:%M %P"))
      tmp.reset_time
      expect(tmp.open_at).to be_nil
      expect(tmp.close_at).to be_nil
    end
  end
end
