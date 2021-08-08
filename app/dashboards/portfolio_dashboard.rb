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
    pictures: Field::ActiveStorage,
    # pictures_attachments: Field::HasMany,
    # pictures_blobs: Field::HasMany,
    id: Field::Number,
    flags_count: Field::Number,
    description: Field::Text,
    created_at: Field::DateTime,
    updated_at: Field::DateTime,
    status: Field::Select.with_options(searchable: false, collection: ->(field) { field.resource.class.send(field.attribute.to_s.pluralize).keys }),
    hair_length: Field::Select.with_options(searchable: false, collection: ->(field) { field.resource.class.hair_length_list }),
    hair_type: Field::Select.with_options(searchable: false, collection: ->(field) { field.resource.class.hair_type_list })
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = %i[
    flags_count
    user
    hair_length
    hair_type
    created_at
    updated_at
  ].freeze
  # hair_types
  # pictures_attachments

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  # pictures_attachments
  # pictures_blobs
  # id
  # status
  SHOW_PAGE_ATTRIBUTES = %i[
    pictures
    user
    description
    hair_type
    hair_length
    service_types
    created_at
    updated_at
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  # pictures_attachments
  # pictures_blobs
  # status
  FORM_ATTRIBUTES = %i[
    pictures
    user
    hair_type
    hair_length
    description
    service_types
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
  COLLECTION_FILTERS = {
    clipper: ->(resources) { resources.where(hair_length: :clipper) },
    ear: ->(resources) { resources.where(hair_length: :ear) },
    chin: ->(resources) { resources.where(hair_length: :chin) },
    shoulder: ->(resources) { resources.where(hair_length: :shoulder) },
    armpit: ->(resources) { resources.where(hair_length: :armpit) },
    mid_back: ->(resources) { resources.where(hair_length: :mid_back) },
    taillbone: ->(resources) { resources.where(hair_length: :taillbone) },
    straight: ->(resources) { resources.where(hair_type: :straight) },
    wavy: ->(resources) { resources.where(hair_type: :wavy) },
    curly: ->(resources) { resources.where(hair_type: :curly) },
    afro: ->(resources) { resources.where(hair_type: :afro) }
  }.freeze
  # Overwrite this method to customize how portfolios are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(portfolio)
  #   "Portfolio ##{portfolio.id}"
  # end
end
