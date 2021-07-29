require "administrate/base_dashboard"

class PortfolioDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    user: Field::BelongsTo,
    service_types: Field::HasMany,
    hair_types: Field::HasMany,
    # pictures_attachments: Field::HasMany,
    # pictures_blobs: Field::HasMany,
    id: Field::Number,
    description: Field::Text,
    created_at: Field::DateTime,
    updated_at: Field::DateTime,
    status: Field::Select.with_options(searchable: false, collection: ->(field) { field.resource.class.send(field.attribute.to_s.pluralize).keys }),
    hair_length: Field::Select.with_options(searchable: false, collection: ->(field) { field.resource.class.send(field.attribute.to_s.pluralize).keys })
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = %i[
    user
    service_types
    hair_types
  ].freeze
  # pictures_attachments

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  # pictures_attachments
  # pictures_blobs
  SHOW_PAGE_ATTRIBUTES = %i[
    user
    service_types
    hair_types
    id
    description
    created_at
    updated_at
    status
    hair_length
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  # pictures_attachments
  # pictures_blobs
  FORM_ATTRIBUTES = %i[
    user
    service_types
    hair_types
    description
    status
    hair_length
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

  # Overwrite this method to customize how portfolios are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(portfolio)
  #   "Portfolio ##{portfolio.id}"
  # end
end
