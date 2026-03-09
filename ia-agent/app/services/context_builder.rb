# frozen_string_literal: true

class ContextBuilder
  SYSTEM_PROMPT = <<~PROMPT.strip
    Você é um assistente que responde APENAS sobre os selos (stamps) existentes no sistema Fideliza e sua relação com os usuários (persons/clientes).
    Use somente os dados fornecidos no contexto abaixo. Não invente dados. Se a pergunta não puder ser respondida com o contexto, diga que não há informação suficiente.
    Responda em português de forma clara e objetiva.
  PROMPT

  # Quantos selos recentes incluir no contexto (ordenados por created_at desc) para perguntas amplas e "último selo"
  RECENT_STAMPS_LIMIT = 200

  # Schema do banco para o agente gerar SQL de relatórios (tabelas e colunas).
  # @return [String] descrição texto das tabelas e colunas
  def self.database_schema_context
    conn = ActiveRecord::Base.connection
    tables = conn.tables.sort
    lines = tables.map do |table_name|
      columns = conn.columns(table_name)
      cols_desc = columns.map { |c| "#{c.name} (#{c.sql_type})#{c.null ? "" : " NOT NULL"}" }.join(", ")
      "  #{table_name}(#{cols_desc})"
    end
    lines.join("\n")
  end

  class << self
    def call
      {
        persons: persons_context,
        campaigns: campaigns_context,
        cards: cards_context,
        stamps: stamps_context,
        stamps_count: Stamp.count
      }.to_json
    end

    private

    def persons_context
      Person.includes(:cards, :stamps).map do |p|
        {
          id: p.id,
          phone_masked: mask_phone(p.phone),
          user_id: p.read_attribute_before_type_cast(:user_id)&.to_s,
          cards_count: p.cards.size,
          stamps_count: p.stamps.size
        }
      end
    end

    def campaigns_context
      Campaign.includes(:business).map do |c|
        {
          id: c.id,
          rule: c.rule,
          prize: c.prize,
          stamps_required: c.stamps_required,
          business_name: c.business&.name
        }
      end
    end

    def cards_context
      Card.includes(:person, :campaign, :stamps).map do |card|
        {
          id: card.id,
          person_id: card.person_id,
          person_phone_masked: card.person&.phone ? mask_phone(card.person.phone) : nil,
          campaign_id: card.campaign_id,
          campaign_rule: card.campaign&.rule,
          stamps_count: card.stamps.size,
          stamps_required: card.campaign&.stamps_required,
          completed_at: card.completed_at,
          prize_code: card.prize_code
        }
      end
    end

    # Selos individuais (últimos por created_at) com dados para pessoa e campanha — permite "último selo" e perguntas amplas
    # campaign_id/campaign_name vêm do card, pois a tabela stamps pode não ter coluna campaign_id
    def stamps_context
      return [] unless Stamp.column_names.include?("created_at")

      Stamp
        .includes(:person, { card: { campaign: :business } })
        .order(created_at: :desc)
        .limit(RECENT_STAMPS_LIMIT)
        .map do |s|
          {
            id: s.id,
            created_at: s.created_at&.iso8601,
            person_id: s.person_id,
            person_phone_masked: s.person&.phone ? mask_phone(s.person.phone) : nil,
            card_id: s.card_id,
            campaign_id: s.card&.campaign_id&.to_s,
            campaign_name: s.card&.campaign&.business&.name
          }
        end
    end

    def mask_phone(phone)
      return "***" if phone.blank?
      return phone if phone.to_s.length < 4
      "*******#{phone.to_s[-4..]}"
    end
  end
end
