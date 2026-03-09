# frozen_string_literal: true

class AskController < ApplicationController
  include ApiKeyAuthenticatable

  rescue_from ActionController::ParameterMissing do
    render json: { answer: nil, error: "prompt é obrigatório" }, status: :bad_request
  end

  def create
    prompt = params.require(:prompt)
    result = AskAgentService.call(prompt)

    if result[:error]
      render json: { answer: nil, error: result[:error] }, status: :unprocessable_entity
    else
      render json: { answer: result[:answer], error: nil }
    end
  end

  # Relatório: gera SQL via agente, executa no banco e retorna os dados. Use somente quando precisar.
  def report
    prompt = params.require(:prompt)
    result = ReportAgentService.call(prompt)

    if result[:error]
      render json: { data: nil, sql: nil, error: result[:error] }, status: :unprocessable_entity
    else
      render json: { data: result[:data], sql: result[:sql], error: nil }
    end
  end
end
