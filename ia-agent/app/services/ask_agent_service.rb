# frozen_string_literal: true

class AskAgentService
  class << self
    # @param prompt [String] user question about stamps/users
    # @return [Hash] { answer: String?, error: String? }
    def call(prompt)
      return { answer: nil, error: "Prompt não pode ser vazio" } if prompt.blank?

      context_json = ContextBuilder.call
      system_content = "#{ContextBuilder::SYSTEM_PROMPT}\n\nDados atuais (JSON):\n#{context_json}"
      user_content = prompt.to_s.strip

      LlmClient.new.chat(system_content: system_content, user_content: user_content)
    rescue StandardError => e
      Rails.logger.error("AskAgentService: #{e.message}")
      { answer: nil, error: e.message }
    end
  end
end
