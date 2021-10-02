ActiveRecord::Migration.say_with_time "Admin" do
 
  if !User.admin.exists?(email: "admin@stylistpage.com")
    user = User.create(email: "admin@stylistpage.com", first_name: "Admin", last_name: "Admin", 
      username: "stylistpage", role: "admin", password: "Stylist1")
    user.skip_confirmation!
    user.activated!
    user.save
  end
end

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
