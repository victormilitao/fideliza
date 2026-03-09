# frozen_string_literal: true

class Person < ApplicationRecord
  self.table_name = "person"
  self.primary_key = "id"

  has_many :stamps, foreign_key: :person_id, inverse_of: :person
  has_many :cards, foreign_key: :person_id, inverse_of: :person

  def readonly?
    true
  end
end
