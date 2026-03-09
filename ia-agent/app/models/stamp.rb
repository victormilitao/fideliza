# frozen_string_literal: true

class Stamp < ApplicationRecord
  self.primary_key = "id"

  belongs_to :person, optional: true
  belongs_to :card, optional: true
  belongs_to :campaign, optional: true

  def readonly?
    true
  end
end
