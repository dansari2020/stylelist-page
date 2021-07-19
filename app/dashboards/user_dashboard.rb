require "administrate/base_dashboard"

class UserDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    id: Field::Number,
    email: Field::String,
    first_name: Field::String,
    last_name: Field::String,
    username: Field::String,
    bio: Field::Text,
    role: Field::Select.with_options(searchable: false, collection: ->(field) { field.resource.class.send(field.attribute.to_s.pluralize).keys }),
    # avatar_attachment: Field::HasOne,
    # avatar_blob: Field::HasOne,
    # background_attachment: Field::HasOne,
    # background_blob: Field::HasOne,
    # address: Field::HasOne,
    # specialties: Field::HasMany,
    # services: Field::HasMany,
    # availabilities: Field::HasMany,
    # social_media: Field::HasMany,
    # portfolios: Field::HasMany,
    # pictures: Field::HasMany,
    # feedbacks: Field::HasMany,
    # languages: Field::HasMany,
    created_at: Field::DateTime,
    updated_at: Field::DateTime,
    status: Field::Select.with_options(searchable: false, collection: ->(field) { field.resource.class.send(field.attribute.to_s.pluralize).keys }),
    started_at: Field::Date,
    education: Field::String,
    phone: Field::String,
    deactivate_reason: Field::Select.with_options(searchable: false, collection: ->(field) { field.resource.class.send(field.attribute.to_s.pluralize).keys }),
    deactivate_description: Field::Text,
    phone_type: Field::Select.with_options(searchable: false, collection: ->(field) { field.resource.class.send(field.attribute.to_s.pluralize).keys }),
    phone_method: Field::Select.with_options(searchable: false, collection: ->(field) { field.resource.class.send(field.attribute.to_s.pluralize).keys }),
    pronoun: Field::String,
    client_incentives: Field::String,
    condition_for_incenrive: Field::String
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = %i[
    email
    first_name
    last_name
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  # avatar_attachment
  # avatar_blob
  # background_attachment
  # background_blob
  # pictures
  # address
  # specialties
  # services
  # availabilities
  # social_media
  # portfolios
  # feedbacks
  # languages
  # status
  SHOW_PAGE_ATTRIBUTES = %i[
    email
    first_name
    last_name
    username
    role
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
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  # avatar_attachment
  # avatar_blob
  # background_attachment
  # background_blob
  # pictures
  # address
  # specialties
  # services
  # availabilities
  # social_media
  # portfolios
  # feedbacks
  # languages
  FORM_ATTRIBUTES = %i[
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
  ].freeze

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
  COLLECTION_FILTERS = {}.freeze

  # Overwrite this method to customize how users are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(user)
  #   "User ##{user.id}"
  # end
end
