# 🎯 Fideliza

Sistema de fidelização digital que permite estabelecimentos criarem campanhas de selos para recompensar clientes frequentes.

## 📋 Sobre o Projeto

O **Fideliza** é uma plataforma completa de fidelização que conecta estabelecimentos comerciais e seus clientes através de um sistema de selos digitais. Os clientes acumulam selos a cada compra e podem trocá-los por prêmios quando completam a campanha.

### ✨ Funcionalidades Principais

#### 🏪 Para Estabelecimentos
- **Gestão de Campanhas**: Crie e gerencie campanhas de fidelização
- **Envio de Selos**: Envie selos digitais para clientes via WhatsApp
- **Controle de Prêmios**: Gerencie códigos de prêmios e recompensas
- **Relatórios**: Acompanhe o progresso das campanhas e selos enviados
- **Dashboard**: Interface intuitiva para gestão completa

#### 👥 Para Clientes
- **Acompanhamento de Selos**: Visualize seus selos acumulados
- **Notificações**: Receba notificações via WhatsApp sobre novos selos
- **Resgate de Prêmios**: Troque selos completos por prêmios
- **Histórico**: Acompanhe seu histórico de fidelização

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database + Auth)
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Testing**: Vitest + Testing Library
- **UI Components**: Radix UI + Lucide React
- **Notifications**: Sonner
- **Routing**: React Router DOM

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd fideliza
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 4. Execute o projeto
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Gera build de produção
npm run preview      # Preview do build de produção

# Qualidade de Código
npm run lint         # Executa o ESLint
npm run test         # Executa os testes
npm run test:watch   # Executa os testes em modo watch
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── button/         # Componentes de botão
│   ├── customer/       # Componentes específicos do cliente
│   ├── ui/            # Componentes de UI base
│   └── bottom-sheet.tsx
├── hooks/              # Custom hooks
│   ├── customer/      # Hooks específicos do cliente
│   ├── user/          # Hooks de usuário
│   └── __tests__/     # Testes dos hooks
├── pages/              # Páginas da aplicação
│   ├── business/      # Páginas do estabelecimento
│   ├── customer/      # Páginas do cliente
│   └── landing/       # Páginas de marketing
├── services/           # Serviços e APIs
│   └── providers/
│       └── supabase/  # Configuração e funções do Supabase
├── store/              # Gerenciamento de estado (Zustand)
├── types/              # Definições de tipos TypeScript
└── utils/              # Utilitários e helpers
```

## 🧪 Testes

O projeto utiliza Vitest para testes unitários e Testing Library para testes de componentes.

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes específicos
npm test -- src/hooks/__tests__/useSendStampByPhone.test.tsx
```

## 📱 Funcionalidades Principais

### Sistema de Autenticação
- Login por telefone com código SMS
- Autenticação por token
- Diferentes níveis de acesso (cliente/estabelecimento)

### Gestão de Selos
- Envio de selos via WhatsApp
- Acompanhamento de progresso
- Notificações automáticas
- Sistema de recompensas

### Interface Responsiva
- Design mobile-first
- Componentes acessíveis
- Animações suaves
- Tema escuro/claro

## 🔧 Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Configure as tabelas necessárias:
   - `persons` - Dados dos clientes
   - `businesses` - Dados dos estabelecimentos
   - `campaigns` - Campanhas de fidelização
   - `cards` - Cartelas de selos
   - `stamps` - Selos individuais
   - `profiles` - Perfis de usuário

3. Configure as políticas de segurança (RLS)
4. Configure as funções Edge para WhatsApp

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através dos canais:
- Email: suporte@fideliza.com
- WhatsApp: (11) 99999-9999

---

Desenvolvido com ❤️ pela equipe Fideliza
