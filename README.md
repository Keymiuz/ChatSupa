# Full-stack real-time chat do Joca

- **Data:** PostgeSQL managed by [Supabase](https://supabase.io/) [@supabase_io](https://twitter.com/supabase_io) 
- **Front-end**: React + Vite
- **UI library**: [chakra-ui](https://chakra-ui.com/) [@chakra_ui](https://twitter.com/chakra_ui)
- **Hospedagem**: Vou colocar no Vercel
- Bandeiras de países provenientes do Flagpedia

## Instalarar

'npm install' para instalar as dependências

## Variáveis do Supabase

Crie um arquivo .env com as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_KEY

## Setup your Supabase project

The following database table is required:

| Field            | Type      |
| ---------------- | --------- |
| id               | BIGINT    |
| username         | VARCHAR   |
| text             | TEXT      |
| country          | VARCHAR   |
| is_authenticated | BOOLEAN   |
| timestamp        | timestamp |

A seguinte tabela no banco de dados é necessária:

```sql
CREATE TABLE messages (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  username VARCHAR NOT NULL,
  text TEXT NOT NULL,
  country VARCHAR,
  is_authenticated BOOLEAN DEFAULT FALSE,
  timestamp timestamp default now() NOT NULL
);
```

Observação: Se você estiver usando a interface do Supabase, não se esqueça de marcar a opção Enable Realtime após criar a tabela.

## Configurar autenticação com GitHub (opcional)
Siga as instruções aqui: https://supabase.com/docs/guides/auth/social-login/auth-github

## Dev

'npm run dev' para rodar o server na porta 3000

## Build

'npm run build'  para compilar o cliente React


