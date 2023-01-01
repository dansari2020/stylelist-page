ActiveRecord::Migration.say_with_time "Admin" do
  if !User.admin.exists?(email: "admin@salonhouse.herokuapp.com")
    user = User.create(email: "admin@salonhouse.herokuapp.com", first_name: "Admin", last_name: "Admin", 
      username: "stylistpageadmin", role: "admin", password: "Stylist1")
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

  ActiveRecord::Migration.say_with_time "Demo Account" do
    unless User.exists?(role: :demo)
      User.create(
        role: :demo,
        first_name: "Patty",
        last_name: "Moore",
        username: "pattymoore",
        email: "pattymoore@mail.com",
        password: "demo1234",
        confirmed_at: Time.now,
        status: "activated",
        bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
        started_at: "Tue, 01 Jan 2019",
        education: "Brio Academy of Cosmetology",
        pronoun: "She/Her",
        register_step: "information"
      )
    end
  end
end
