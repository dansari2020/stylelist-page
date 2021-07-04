ActiveRecord::Migration.say_with_time "Languages" do
  if Language.count.zero?
    Language.create([
      {name: "English"},
      {name: "Spanish"},
      {name: "Hindi"},
      {name: "Italian"},
      {name: "Japanese"},
      {name: "Korean"},
      {name: "Mandarin"},
      {name: "German"},
      {name: "French"},
      {name: "Portuguese"},
      {name: "Russian"},
      {name: "Arabic"}
    ])
  end
end
