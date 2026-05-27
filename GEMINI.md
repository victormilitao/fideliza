# Fideliza - Instruções para Agentes IA

## Regras de Desenvolvimento

### 1. Novas funções server-side devem ser API Routes do Next.js

**NÃO** criar novas Supabase Edge Functions para funcionalidades do app.

Todas as novas funções server-side devem ser criadas como **API Routes do Next.js** dentro de `src/app/api/`.

#### Padrão de estrutura:
```
src/app/api/
├── auth/
│   ├── reset-password/route.ts
│   └── update-password/route.ts
├── email/
│   └── send/route.ts
└── stripe/
    └── reactivate-subscription/route.ts
```

#### Padrão de implementação:
```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // ... lógica
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
```

#### Por que:
- Mantém toda a lógica dentro do repositório do app
- Facilita debug e testes
- Não depende de deploys separados no Supabase
- Variáveis de ambiente ficam centralizadas no `.env.local`

### 2. Chamadas client-side para API Routes

As funções em `src/services/providers/supabase/api-functions/` devem usar `fetch('/api/...')` para chamar API Routes locais, **não** `supabase.functions.invoke()`.

```typescript
// ✅ Correto - API Route local
const response = await fetch('/api/stripe/reactivate-subscription', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ subscription_id: subscriptionId }),
})

// ❌ Errado - Edge Function
const { data, error } = await supabase.functions.invoke('reactivate-subscription', {
  method: 'POST',
  body: requestBody,
})
```

### 3. Internacionalização (i18n)

O projeto atualmente **não** usa biblioteca de internacionalização. Todos os textos ficam hardcoded em português nos componentes.

### 4. Testes

- Manter pelo menos 90% de cobertura nos testes automatizados
- Usar `vitest` para testes unitários
- Usar `playwright` para testes e2e
- Nos testes e2e, fazer o fluxo principal via UI; usar API apenas para suporte de dados

### 5. Variáveis de Ambiente

- Variáveis de ambiente do Stripe (`STRIPE_SECRET_KEY`) ficam em `.env.local`
- Variáveis públicas usam o prefixo `NEXT_PUBLIC_`
