# Agrofluxo — frontend

Fundação visual e estrutural do frontend do SaaS de manejo de irrigação por aspersão.

## Stack

- React + TypeScript: componentes tipados e manutenção segura.
- Vite: desenvolvimento local rápido e build enxuto.
- React Router: navegação declarativa entre módulos.
- Lucide React: conjunto consistente de ícones.
- CSS com tokens centralizados: controle explícito da identidade visual e responsividade sem abstrações desnecessárias.

## Executar localmente

Requer Node.js 20+ e npm ou pnpm.

```bash
npm install
npm run dev
```

Para validar o build de produção:

```bash
npm run build
npm run preview
```

## Estrutura

```text
src/
├── components/   # Sidebar, Header, PageHeader e EmptyState
├── layouts/      # AppLayout compartilhado
├── lib/          # Configuração de módulos e navegação
├── pages/        # Dashboard e páginas iniciais dos módulos
└── styles/       # Tokens, layout e responsividade
```

As páginas estão preparadas para integração futura, mas não incluem chamadas ao backend, regras de negócio ou dados fictícios.
