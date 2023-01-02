include ActionView::Helpers::AssetTagHelper


ActiveRecord::Migration.say_with_time "Admin" do
  unless User.admin.exists?(email: "admin@salonhouse.herokuapp.com") ||
    User.admin.exists?(username: "stylistpageadmin")
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
      { name: "English", primary: true },
      { name: "Spanish", primary: true },
      { name: "Hindi", primary: true },
      { name: "Italian", primary: true },
      { name: "Japanese", primary: true },
      { name: "Korean", primary: true },
      { name: "Mandarin", primary: true },
      { name: "German", primary: true },
      { name: "French", primary: true },
      { name: "Portuguese", primary: true },
      { name: "Russian", primary: true },
      { name: "Arabic", primary: true }
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
    demo = User.find_or_initialize_by(role: :demo)
    demo.assign_attributes(
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
      register_step: "information",
      static_avatar_url: "demo/avatar.png",
      static_background_url: "demo/bk.png",
      specialties_attributes: [
        { id: demo.specialties.find_by(name: 'Curly Hair')&.id, name: 'Curly Hair' },
        { id: demo.specialties.find_by(name: 'Skin Fades')&.id, name: 'Skin Fades' },
        { id: demo.specialties.find_by(name: 'Brows')&.id, name: 'Brows' }
      ],
      services_attributes: [
        { id: demo.services.find_by(name: 'Kids Cuts')&.id, name: 'Kids Cuts' },
        { id: demo.services.find_by(name: 'Women Cuts')&.id, name: 'Women Cuts' },
        { id: demo.services.find_by(name: 'Perms')&.id, name: 'Perms' },
        { id: demo.services.find_by(name: 'Wedding Styles')&.id, name: 'Wedding Styles' },
        { id: demo.services.find_by(name: 'Scissor Cuts')&.id, name: 'Scissor Cuts' },
        { id: demo.services.find_by(name: 'Updos')&.id, name: 'Updos' },
        { id: demo.services.find_by(name: 'Color')&.id, name: 'Color' },
        { id: demo.services.find_by(name: 'Waxing')&.id, name: 'Waxing' },
      ],
      availabilities_attributes: [
        {
          id: demo.availabilities.find_by(day: 'Sunday')&.id,
          day: 'Sunday',
          open_at: nil,
          close_at: nil,
          opened: false,
          open_at_ampm: 0,
          close_at_ampm: 0
        },
        {
          id: demo.availabilities.find_by(day: 'Monday')&.id,
          day: 'Monday',
          open_at: '09:00 am',
          close_at: '07:00 pm',
          opened: true,
          open_at_ampm: 0,
          close_at_ampm: 0
        },
        {
          id: demo.availabilities.find_by(day: 'Tuesday')&.id,
          day: 'Tuesday',
          open_at: '09:00 am',
          close_at: '07:00 pm',
          opened: true,
          open_at_ampm: 0,
          close_at_ampm: 0
        },
        {
          id: demo.availabilities.find_by(day: 'Wednesday')&.id,
          day: 'Wednesday',
          open_at: '09:00 am',
          close_at: '07:00 pm',
          opened: true,
          open_at_ampm: 0,
          close_at_ampm: 0
        },
        {
          id: demo.availabilities.find_by(day: 'Thursday')&.id,
          day: 'Thursday',
          open_at: '09:00 am',
          close_at: '07:00 pm',
          opened: true,
          open_at_ampm: 0,
          close_at_ampm: 0
        },
        {
          id: demo.availabilities.find_by(day: 'Friday')&.id,
          day: 'Friday',
          open_at: '09:00 am',
          close_at: '02:00 pm',
          opened: true,
          open_at_ampm: 0,
          close_at_ampm: 0
        },
        {
          id: demo.availabilities.find_by(day: 'Saturday')&.id,
          day: 'Saturday',
          open_at: nil,
          close_at: nil,
          opened: false,
          open_at_ampm: 0,
          close_at_ampm: 0
        },
      ],
      languages_attributes: [
        {
          id: demo.languages.find_by(name: 'English')&.id,
          primary: true,
          name: 'English'
        },
        {
          id: demo.languages.find_by(name: 'Spanish')&.id,
          primary: false,
          name: 'Spanish'
        },
      ],
      social_media_attributes: [
        {
          id: demo.social_media.find_by(kind: 'twitter')&.id,
          kind: 'twitter',
          url: '#'
        },
        {
          id: demo.social_media.find_by(kind: 'facebook')&.id,
          kind: 'facebook',
          url: '#'
        },
        {
          id: demo.social_media.find_by(kind: 'instagram')&.id,
          kind: 'instagram',
          url: '#'
        },
      ],
      portfolios_attributes:
        24.times.map do |i|
          {
            id: demo.portfolios[i]&.id,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            hair_length: Portfolio.hair_lengths.keys.sample,
            hair_type: Portfolio.hair_types.keys.sample,
            image_url_type: 'url',
            static_image_url: "demo/#{i+1}.png",
            status: 'published',
          }
        end
    )
    demo.save!
  end
end
