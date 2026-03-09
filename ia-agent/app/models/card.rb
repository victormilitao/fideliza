# frozen_string_literal: true

class Card < ApplicationRecord
  self.primary_key = "id"

  belongs_to :person, optional: true
  belongs_to :campaign, optional: true
  has_many :stamps, foreign_key: :card_id, inverse_of: :card, dependent: nil

  def readonly?
    true
  end
end
