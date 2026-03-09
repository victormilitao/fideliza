# frozen_string_literal: true

class Business < ApplicationRecord
  self.table_name = "business"
  self.primary_key = "id"

  has_many :campaigns, foreign_key: :business_id, inverse_of: :business

  def readonly?
    true
  end
end
