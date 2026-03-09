# frozen_string_literal: true

class Campaign < ApplicationRecord
  self.primary_key = "id"

  belongs_to :business, optional: true
  has_many :cards, foreign_key: :campaign_id, inverse_of: :campaign
  has_many :stamps, foreign_key: :campaign_id, inverse_of: :campaign

  def readonly?
    true
  end
end
