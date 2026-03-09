# frozen_string_literal: true

class LlmClient
  OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions"
  DEFAULT_MODEL = "gpt-4o-mini"

  def initialize(api_key: nil)
    @api_key = api_key || ENV["OPENAI_API_KEY"]
  end

  def chat(system_content:, user_content:)
    return { error: "OPENAI_API_KEY não configurada" } if @api_key.blank?

    body = {
      model: ENV.fetch("OPENAI_MODEL", DEFAULT_MODEL),
      messages: [
        { role: "system", content: system_content },
        { role: "user", content: user_content }
      ]
    }

    response = HTTParty.post(
      OPENAI_CHAT_URL,
      body: body.to_json,
      headers: {
        "Content-Type" => "application/json",
        "Authorization" => "Bearer #{@api_key}"
      }
    )

    if response.success?
      content = response.dig("choices", 0, "message", "content")
      { answer: content.presence || "", error: nil }
    else
      { answer: nil, error: response.parsed_response&.dig("error", "message") || response.message }
    end
  rescue StandardError => e
    { answer: nil, error: e.message }
  end
end
