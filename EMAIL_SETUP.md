# Configuração do EmailJS

Este projeto usa EmailJS como serviço de email alternativo ao Resend.

## Configuração

### 1. Criar conta no EmailJS
- Acesse [emailjs.com](https://www.emailjs.com/)
- Crie uma conta gratuita
- Verifique seu email

### 2. Configurar Service
- No dashboard do EmailJS, vá em "Email Services"
- Clique em "Add New Service"
- Escolha seu provedor de email (Gmail, Outlook, etc.)
- Configure as credenciais
- Anote o **Service ID**

### 3. Criar Template
- Vá em "Email Templates"
- Clique em "Create New Template"
- Use este template **MUITO SIMPLES** para teste:

```html
<!DOCTYPE html>
<html>
<head>
    <title>{{subject}}</title>
</head>
<body>
    <h2>{{subject}}</h2>
    <p>{{message}}</p>
    
    {{#if confirmation_link}}
    <p>Clique aqui para confirmar: <a href="{{confirmation_link}}">{{confirmation_link}}</a></p>
    {{/if}}
</body>
</html>
```

- Anote o **Template ID**

### 4. Obter Public Key
- Vá em "Account" > "API Keys"
- Copie sua **Public Key**

### 5. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=seu_service_id
VITE_EMAILJS_TEMPLATE_ID=seu_template_id
VITE_EMAILJS_PUBLIC_KEY=sua_public_key
```

## Uso

O serviço está integrado e pode ser usado através da API:

```typescript
import api from '@/services/api'

// Enviar confirmação de email
await api.sendEmailConfirmation('user@example.com', 'https://link.com')

// Enviar notificação de selo
await api.sendStampNotification('user@example.com', 'Loja ABC', 5, 10)

// Enviar código de premiação
await api.sendRewardCode('user@example.com', 'Loja ABC', 'ABC123', 'Pizza grátis')
```

## Limites Gratuitos
- EmailJS Free: 200 emails/mês
- Para mais emails, considere um plano pago
