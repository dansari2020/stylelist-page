ActiveRecord::Migration.say_with_time "Languages" do
  def find_by_language(name)
    [
      {name: "English", primary: true},
      {name: "Spanish", primary: true},
      {name: "Hindi", primary: true},
      {name: "Italian", primary: true},
      {name: "Japanese", primary: true},
      {name: "Korean", primary: true},
      {name: "Mandarin", primary: true},
      {name: "German", primary: true},
      {name: "French", primary: true},
      {name: "Portuguese", primary: true},
      {name: "Russian", primary: true},
      {name: "Arabic", primary: true}
    ].find do |lng|
      lng[:name].to_s.downcase == name.to_s.downcase
    end
  end

  LanguageList::COMMON_LANGUAGES.map(&:name).each do |name|
    common = find_by_language(name)
    language = Language.find_or_initialize_by(name: common.present? ? common[:name] : name)
    language.primary = common.present? ? common[:primary] : false
    language.save
  end
end
