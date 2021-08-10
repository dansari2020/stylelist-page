require "administrate/base_dashboard"

class AddressDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    # user: Field::BelongsTo,
    # id: Field::Number,
    street: Field::String,
    postal: Field::String,
    province: Field::String,
    country_code: Field::String,
    salon_name: Field::String,
    unit_suit: Field::String,
    city: Field::String,
    privacy: Field::Boolean
    # created_at: Field::DateTime,
    # updated_at: Field::DateTime,
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  # user
  # id
  COLLECTION_ATTRIBUTES = %i[
    street
    postal
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  # user
  # id
  # created_at
  # updated_at
  # street
  # postal
  # province
  # country_code
  # salon_name
  # unit_suit
  # city
  # privacy
  SHOW_PAGE_ATTRIBUTES = %i[
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  # user
  FORM_ATTRIBUTES = %i[
    street
    postal
    province
    country_code
    salon_name
    unit_suit
    city
    privacy
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

  # Overwrite this method to customize how addresses are displayed
  # across all pages of the admin dashboard.
  #
  def display_resource(address)
    Array.wrap(address.full_address).join(", ")
  end
end
