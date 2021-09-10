require "administrate/base_dashboard"

class UserDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    # avatar: Field::ActiveStorage.with_options(
    #   index_preview_size: [50, 50]
    # ),
    avatar: GravatarField,
    avatar_thumb: GravatarField,
    background: BackgroundImageField,
    id: Field::Number,
    email: Field::String,
    first_name: Field::String,
    last_name: Field::String,
    full_name: Field::String.with_options(
      searchable: false
    ),
    username: Field::String,
    bio: Field::Text,
    role: Field::Select.with_options(searchable: false, collection: ->(field) { field.resource.class.role_list }),
    job: Field::String.with_options(
      searchable: false
    ),
    # portfolios: Field::HasMany,
    # pictures: Field::HasMany,
    address: Field::HasOne.with_options(
      searchable: true,
      searchable_fields: %w[street postal province country_code salon_name unit_suit city],
      include_blank: true
    ),
    short_address: Field::String.with_options(
      searchable: false
    ),
    active: BooleanIconField,
    specialties: TagsField,
    services: TagsField,
    availabilities: Field::HasMany.with_options(limit: 7, sort_by: :day),
    social_media: Field::HasMany,
    # languages: Field::HasMany,
    created_at: Field::DateTime,
    updated_at: Field::DateTime,
    status: Field::Select.with_options(searchable: false, collection: ->(field) { field.resource.class.status_list }),
    started_at: Field::Date,
    education: Field::String,
    phone: Field::String,
    deactivate_reason: Field::Select.with_options(searchable: false, collection: ->(field) { field.resource.class.send(field.attribute.to_s.pluralize).keys }),
    deactivate_description: Field::Text,
    phone_type: Field::Select.with_options(searchable: false, collection: ->(field) { field.resource.class.send(field.attribute.to_s.pluralize).keys }),
    phone_method: Field::Select.with_options(searchable: false, collection: ->(field) { field.resource.class.send(field.attribute.to_s.pluralize).keys }),
    pronoun: Field::String,
    client_incentives: Field::String,
    condition_for_incenrive: Field::String,
    flags_count: Field::Number
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = %i[
    avatar_thumb
    full_name
    job
    short_address
    active
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  # avatar_attachment
  # avatar_blob
  # background_attachment
  # background_blob
  # pictures
  # status
  SHOW_PAGE_ATTRIBUTES = %i[
    background
    avatar_thumb
    email
    first_name
    last_name
    username
    job
    bio
    started_at
    education
    phone
    deactivate_reason
    deactivate_description
    phone_type
    phone_method
    pronoun
    client_incentives
    condition_for_incenrive
    address
    specialties
    services
    availabilities
    social_media
  ].freeze
  # languages

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  # avatar_attachment
  # avatar_blob
  # background_attachment
  # background_blob
  # pictures
  FORM_ATTRIBUTES = %i[
    background
    avatar_thumb
    email
    first_name
    last_name
    username
    role
    status
    bio
    started_at
    education
    phone
    deactivate_reason
    deactivate_description
    phone_type
    phone_method
    pronoun
    client_incentives
    condition_for_incenrive
    address
  ].freeze
  # specialties
  # services
  # availabilities
  # social_media
  # languages

  # COLLECTION_FILTERS
  # a hash that defines filters that can be used while searching via the search
  # field of the dashboard.
  #
  # For example to add an option to search for open resources by typing "open:"
  # in the search field:
  #
  #   COLLECTION_FILTERS = {
  #     open: ->(resources) { resources.where(open: true) }
  #   }.freeze
  COLLECTION_FILTERS = {
    hair_stylist: ->(resources) { resources.where(role: :hair_stylist) },
    barber: ->(resources) { resources.where(role: :barber) },
    active: ->(resources) { resources.where(status: [:pending, :activated]) },
    deactivated: ->(resources) { resources.where(status: :deactivated) },
    no_posts: ->(resources) { resources.where(portfolios_count: 0) },
    has_posts: ->(resources) { resources.where("portfolios_count > 0") }
  }.freeze

  # Overwrite this method to customize how users are displayed
  # across all pages of the admin dashboard.
  #
  def display_resource(user)
    user.full_name
  end
end
