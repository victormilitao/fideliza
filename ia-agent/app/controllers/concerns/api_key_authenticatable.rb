# frozen_string_literal: true

module ApiKeyAuthenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_api_key!, if: -> { api_key_required? }
  end

  private

  def api_key_required?
    ENV["AGENT_API_KEY"].present?
  end

  def authenticate_api_key!
    key = request.headers["X-API-Key"]
    return head :unauthorized if key.blank? || key != ENV["AGENT_API_KEY"]
  end
end
