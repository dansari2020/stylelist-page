# require "administrate/field/base"
require "administrate/field/associative"

class HasOne < Administrate::Field::Base
  def self.permitted_attribute(attr, options = {})
    # resource_class = options[:resource_class]
    # final_associated_class_name =
    #   if options.key?(:class_name)
    #     Administrate.warn_of_deprecated_option(:class_name)
    #     options.fetch(:class_name)
    #   elsif resource_class
    #     associated_class_name(resource_class, attr)
    #   else
    #     Administrate.warn_of_missing_resource_class
    #     if options
    #       attr.to_s.singularize.camelcase
    #     else
    #       attr
    #     end
    #   end

    # dashboard_class = "#{attr.to_s.classify}Dashboard".safe_constantize
    related_dashboard_attributes =
      Administrate::ResourceResolver
        .new("admin/#{attr.to_s.pluralize.downcase}")
        .dashboard_class.new.permitted_attributes + [:id]
    {"#{attr}_attributes": related_dashboard_attributes}
  end

  def nested_form
    @nested_form ||= Administrate::Page::Form.new(
      resolver.dashboard_class.new,
      data || resolver.resource_class.new
    )
  end

  def nested_show
    @nested_show ||= Administrate::Page::Show.new(
      resolver.dashboard_class.new,
      data || resolver.resource_class.new
    )
  end

  def linkable?
    data.try(:persisted?)
  end

  def display_associated_resource
    "#{attribute.to_s.classify}Dashboard".safe_constantize.new.display_resource(data)
  end

  def associated_class_name
    attribute.to_s.pluralize.downcase
  end

  private

  def resolver
    @resolver ||=
      Administrate::ResourceResolver.new("admin/#{associated_class_name}")
  end
end
