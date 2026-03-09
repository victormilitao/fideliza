# IA Agent (Fideliza)

POC de agente de IA em Ruby on Rails que responde perguntas sobre **selos** existentes e sua relação com os **usuários** (persons). Dados lidos do Supabase (Postgres).

## Pré-requisitos

- Ruby (ver `.ruby-version`)
- PostgreSQL (local ou Supabase)

## Configuração

1. Copie o exemplo de env:
   ```bash
   cp .env.example .env
   ```

2. Preencha no `.env`:
   - **DATABASE_URL**: connection string do Supabase (Settings → Database) ou Postgres local. Se vazio, usa banco local `ia_agent_development`.
   - **OPENAI_API_KEY**: chave da API OpenAI para o LLM.
   - **AGENT_API_KEY** (opcional): se definido, o endpoint `/ask` exige header `X-API-Key` com esse valor.
   - **CORS_ORIGINS** (opcional): origens permitidas para CORS, separadas por vírgula (padrão: `http://localhost:5173`).

3. Se usar banco local (sem DATABASE_URL), crie o banco:
   ```bash
   bin/rails db:create
   ```
   Para usar apenas Supabase, defina `DATABASE_URL` e não é necessário criar banco local.

## Executando

```bash
bundle install
bin/rails server
```

Por padrão: `http://localhost:3000`.

## Uso do endpoint

**POST /ask**

- Body (JSON): `{ "prompt": "Quantos selos o usuário X tem?" }`
- Resposta: `{ "answer": "..." }` ou `{ "answer": null, "error": "..." }`
- Se `AGENT_API_KEY` estiver definido, envie header: `X-API-Key: <valor>`.

Exemplo com curl:

```bash
curl -X POST http://localhost:3000/ask \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Quantos selos existem no total?"}'
```

## Estrutura

- **Models** (read-only): `Person`, `Stamp`, `Card`, `Campaign`, `Business` — tabelas do Supabase (`person`, `stamps`, `cards`, `campaigns`, `business`).
- **ContextBuilder**: monta o contexto (persons, campaigns, cards) em JSON para o LLM.
- **LlmClient**: chama a API OpenAI (chat completions).
- **AskAgentService**: orquestra contexto + system prompt + chamada ao LLM e retorna a resposta.

O agente responde **apenas** com base nos dados existentes; não inventa informações.
