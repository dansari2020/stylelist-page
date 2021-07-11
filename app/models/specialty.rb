class Specialty < ApplicationRecord
  validates :name, presence: true

  belongs_to :user

  after_create_commit { broadcast_prepend_to "specialties" }
  after_update_commit { broadcast_replace_to "specialties" }
  after_destroy_commit { broadcast_remove_to "specialties" }
  after_create_commit { broadcast_prepend_to "specialty" }
  after_update_commit { broadcast_replace_to "specialty" }
  after_destroy_commit { broadcast_remove_to "specialty" }
end
