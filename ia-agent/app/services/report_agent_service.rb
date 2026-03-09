# frozen_string_literal: true

# Gera SQL via LLM a partir do schema e do prompt, executa a query e retorna o resultado.
# Use somente quando precisar de relatórios que exigem execução de SQL no banco.
class ReportAgentService
  SYSTEM_PROMPT = <<~PROMPT.strip
    Você é um assistente que gera relatórios em SQL. Sua resposta deve conter APENAS uma única query SELECT, nada mais.
    Use somente as tabelas e colunas do schema abaixo. Não invente tabelas ou colunas.
    Retorne só o SQL, sem explicação. Se quiser, pode envolver em um bloco de código markdown (```sql ... ```).

    Schema do banco (tabelas e colunas):
  PROMPT

  class << self
    # @param prompt [String] descrição do relatório desejado
    # @return [Hash] { data: Array<Hash>?, sql: String?, error: String? }
    def call(prompt)
      return { data: nil, sql: nil, error: "Prompt não pode ser vazio" } if prompt.blank?

      schema = ContextBuilder.database_schema_context
      system_content = "#{SYSTEM_PROMPT}\n#{schema}"
      user_content = prompt.to_s.strip

      result = LlmClient.new.chat(system_content: system_content, user_content: user_content)
      return { data: nil, sql: nil, error: result[:error] } if result[:error]

      sql = extract_sql(result[:answer])
      return { data: nil, sql: nil, error: "Nenhum SQL encontrado na resposta do agente" } if sql.blank?

      unless select_only?(sql)
        return { data: nil, sql: sql, error: "Apenas consultas SELECT são permitidas" }
      end

      rows = execute_query(sql)
      { data: rows, sql: sql, error: nil }
    rescue StandardError => e
      Rails.logger.error("ReportAgentService: #{e.message}")
      { data: nil, sql: nil, error: e.message }
    end

    private

    def extract_sql(answer)
      return answer.to_s.strip if answer.blank?

      s = answer.strip
      if s.start_with?("```")
        s = s.sub(/\A```\w*\s*\n?/, "").sub(/\n?```\s*\z/, "").strip
      end
      s.presence
    end

    def select_only?(sql)
      normalized = sql.gsub(/--[^\n]*/, "").gsub(%r{/\*.*?\*/}m, "").strip.upcase
      return false if normalized.blank?

      first_stmt = normalized.sub(/;\s*\z/, "").strip
      return false if first_stmt.include?(";")
      return false unless first_stmt.start_with?("SELECT")

      dangerous = %w[INSERT UPDATE DELETE DROP TRUNCATE CREATE ALTER GRANT REVOKE EXEC]
      dangerous.none? { |kw| first_stmt.include?(kw) }
    end

    def execute_query(sql)
      sql = sql.sub(/;\s*\z/, "").strip
      result = ActiveRecord::Base.connection.select_all(sql)
      result.to_a
    end
  end
end
