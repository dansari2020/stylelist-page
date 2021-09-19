require "administrate/base_dashboard"

class AvailabilityDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  # user: Field::BelongsTo,
  # id: Field::Number,
  # created_at: Field::DateTime,
  # updated_at: Field::DateTime,
  ATTRIBUTE_TYPES = {
    day: Field::Select.with_options(searchable: false, collection: ->(field) { field.resource.class.send(field.attribute.to_s.pluralize).keys }),
    working_hours: Field::String,
    open_at: Field::Time,
    opened: Field::Boolean,
    close_at: Field::Time
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  # user
  # id
  COLLECTION_ATTRIBUTES = %i[
    day
    working_hours
    opened
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  # user
  # id
  # created_at
  # updated_at
  SHOW_PAGE_ATTRIBUTES = %i[
    day
    open_at
    close_at
    opened
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  # user
  FORM_ATTRIBUTES = %i[
    day
    open_at
    close_at
    opened
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

  # Overwrite this method to customize how availabilities are displayed
  # across all pages of the admin dashboard.
  #
  def display_resource(availability)
    availability.info
  end
end
