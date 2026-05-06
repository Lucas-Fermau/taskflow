# TaskFlow

Aplicação full-stack de gerenciamento de tarefas com autenticação, prioridades, datas de entrega, busca e tema claro/escuro.

> Projeto de portfólio criado para demonstrar engenharia full-stack: API REST tipada, arquitetura em camadas, autenticação JWT, cache com invalidação automática no front e UI responsiva.

---

## Stack

**Back-end** — Node.js · Express · TypeScript · Prisma · PostgreSQL · Zod · JWT · bcrypt
**Front-end** — React 18 · Vite · TypeScript · Tailwind CSS · TanStack Query · React Hook Form · React Router
**Infra** — Docker Compose (opcional) · Neon/Supabase (alternativa cloud)

---

## Funcionalidades

- Cadastro e login com e-mail e senha (JWT + bcrypt)
- Cada usuário só enxerga as próprias tarefas (isolamento garantido na camada de serviço)
- Criar, editar, excluir e marcar tarefas como concluídas
- Definir prioridade (Baixa / Média / Alta) e data de entrega
- Filtrar por status (todas / pendentes / concluídas) e por prioridade
- Buscar tarefa pelo título (case-insensitive)
- Dashboard com totais: total / pendentes / concluídas / atrasadas
- Tema claro e escuro com detecção da preferência do sistema
- Layout responsivo (funciona no celular)
- Notificações (toasts) de sucesso e erro
- Validação de variáveis de ambiente (servidor não sobe se .env estiver errado)
- Tratamento centralizado de erros (Zod / Prisma / erros de aplicação) com JSON limpo

---

## Como usar a aplicação

Depois de rodar o projeto (passo a passo na seção **Como rodar local** abaixo), abra **http://localhost:5173** no navegador. O fluxo do usuário é:

### 1. Criar conta

- Na tela de login, clique em **"Crie uma"** logo abaixo do botão.
- Preencha **nome**, **e-mail** e **senha** (mínimo 8 caracteres).
- Ao clicar em **"Create account"**, você é autenticado automaticamente e cai no dashboard.

### 2. Login e Logout

- Quando voltar depois, faça login normal com o e-mail e senha cadastrados.
- Para sair, clique em **"Logout"** no topo direito da tela. O token é apagado e você volta para a tela de login.

### 3. Criar uma tarefa

- No dashboard, clique no botão **"+ New task"** no canto superior direito.
- Um modal abre com os campos:
  - **Title** (obrigatório, até 200 caracteres)
  - **Description** (opcional)
  - **Priority** — Low / Medium / High (padrão: Medium)
  - **Due date** — data e hora de entrega (opcional)
- Clique em **"Create task"**. A tarefa aparece imediatamente na lista.

### 4. Marcar como concluída

- Clique no **checkbox redondo** à esquerda do título da tarefa.
- A tarefa fica riscada e meio-transparente, indicando que está concluída.
- Clicar de novo desfaz (volta a ser pendente).

### 5. Editar uma tarefa

- Passe o mouse sobre a tarefa: dois ícones aparecem à direita.
- Clique no ícone de **lápis** para abrir o modal de edição com os dados pré-preenchidos.
- Altere o que precisar e clique em **"Save changes"**.

### 6. Excluir uma tarefa

- Passe o mouse sobre a tarefa e clique no ícone de **lixeira**.
- Aparece uma confirmação ("Delete X?"). Confirme para apagar.

### 7. Filtrar e buscar

Logo acima da lista de tarefas há uma linha de filtros:

- **Campo de busca**: digite parte do título da tarefa para filtrar em tempo real.
- **Status**: alterne entre **All**, **Pending** e **Completed** para ver só pendentes ou só concluídas.
- **Priority**: filtre por nível (Low / Medium / High) ou deixe em "Any priority" para mostrar todas.

Os três filtros funcionam combinados.

### 8. Dashboard de estatísticas

No topo do dashboard há **4 cartões** que atualizam automaticamente quando você cria, edita ou conclui tarefas:

- **Total tasks** — total de tarefas que você criou
- **Pending** — tarefas ainda não concluídas
- **Completed** — tarefas finalizadas
- **Overdue** — tarefas com data de entrega no passado e que ainda não foram concluídas (atrasadas)

### 9. Tema claro / escuro

Clique no ícone de **lua / sol** no topo direito para alternar o tema. Sua preferência fica salva no navegador (volta no mesmo tema na próxima visita).

---

## Arquitetura

```
TaskFlow/
├── server/                    API REST (Express + Prisma)
│   ├── prisma/schema.prisma
│   └── src/
│       ├── config/env.ts          → validação tipada das variáveis de ambiente
│       ├── lib/                    → cliente Prisma, helpers de JWT
│       ├── middleware/             → autenticação, tratamento de erros
│       ├── routes/                 → /auth, /tasks
│       ├── controllers/            → recebem request, chamam service, respondem
│       ├── services/               → regras de negócio + checagem de propriedade
│       ├── schemas/                → schemas Zod (validação + tipos)
│       ├── app.ts                  → factory do Express
│       └── index.ts                → bootstrap do servidor
└── client/                    SPA React (Vite + Tailwind)
    └── src/
        ├── contexts/               → Auth, Theme
        ├── lib/                    → cliente HTTP, query client
        ├── hooks/                  → useTasks, useToast
        ├── components/
        │   ├── ui/                 → Button, Input, Modal, Toast
        │   ├── layout/             → Header
        │   ├── tasks/              → TaskCard, TaskList, TaskForm, TaskFilters
        │   └── dashboard/          → StatsCards
        ├── pages/                  → Login, Register, Dashboard
        └── App.tsx                 → roteamento + providers
```

A separação `routes → controllers → services → prisma` mantém a camada HTTP separada da lógica de negócio. Toda mutação passa por `assertOwnership` no service, então é impossível um usuário editar a tarefa de outro mesmo manipulando o ID na requisição.

---

## API REST

Todas as rotas em `/api/tasks/*` exigem o header `Authorization: Bearer <token>`.

| Método | Endpoint              | Descrição                                                |
| ------ | --------------------- | -------------------------------------------------------- |
| GET    | `/api/health`         | Health check do servidor                                 |
| POST   | `/api/auth/register`  | Cria usuário, retorna `{ user, token }`                  |
| POST   | `/api/auth/login`     | Autentica, retorna `{ user, token }`                     |
| GET    | `/api/auth/me`        | Retorna o usuário autenticado                            |
| GET    | `/api/tasks`          | Lista tarefas (`?status=&search=&priority=`)             |
| GET    | `/api/tasks/stats`    | Retorna `{ total, pending, completed, overdue }`         |
| POST   | `/api/tasks`          | Cria tarefa                                              |
| PATCH  | `/api/tasks/:id`      | Atualiza qualquer subconjunto de campos                  |
| DELETE | `/api/tasks/:id`      | Exclui tarefa                                            |

### Exemplo

```bash
# Cadastro
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada","email":"ada@example.com","password":"hunter2hunter2"}'

# Criar tarefa (use o token retornado acima)
curl -X POST http://localhost:4000/api/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Entregar portfólio","priority":"HIGH","dueDate":"2026-05-30T17:00:00.000Z"}'
```

---

## Como rodar local

### Pré-requisitos

- **Node.js 20 ou superior**
- **PostgreSQL** — escolha uma das opções:
  - **Docker** (mais fácil): `docker compose up -d`
  - **Neon ou Supabase** (cloud, grátis): copie a connection string e cole no `.env`
  - **Postgres instalado localmente** (versão 14+)

### 1. Clonar e instalar

```bash
git clone https://github.com/Lucas-Fermau/taskflow.git
cd taskflow

# Instala as dependências dos dois pacotes
cd server && npm install
cd ../client && npm install
```

### 2. Configurar variáveis de ambiente

```bash
# Back-end
cp server/.env.example server/.env

# Gere uma chave JWT segura
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Cole o resultado em server/.env como JWT_SECRET

# Front-end
cp client/.env.example client/.env
```

### 3. Subir o banco de dados

```bash
# Opção A — Docker (recomendado)
docker compose up -d

# Opção B — Neon/Supabase
# Substitua DATABASE_URL em server/.env pela sua connection string

# Aplique as migrations
cd server
npm run prisma:migrate -- --name init
```

### 4. Rodar a aplicação

Em **dois terminais separados**:

```bash
# Terminal 1 — API
cd server && npm run dev          # http://localhost:4000

# Terminal 2 — Front-end
cd client && npm run dev          # http://localhost:5173
```

Abra **http://localhost:5173** no navegador, crie uma conta e comece a usar (veja a seção **Como usar a aplicação** acima).

---

## Scripts disponíveis

### Server (`/server`)

| Comando                  | O que faz                                      |
| ------------------------ | ---------------------------------------------- |
| `npm run dev`            | Sobe o servidor com hot-reload (`tsx`)         |
| `npm run build`          | Compila TypeScript para `dist/`                |
| `npm start`              | Roda a versão compilada (produção)             |
| `npm run prisma:migrate` | Aplica migrations em desenvolvimento           |
| `npm run prisma:deploy`  | Aplica migrations em produção                  |
| `npm run prisma:studio`  | Abre o Prisma Studio (UI do banco)             |

### Client (`/client`)

| Comando             | O que faz                          |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Sobe o Vite em dev                 |
| `npm run build`     | Type-check + bundle de produção    |
| `npm run preview`   | Preview do build de produção       |
| `npm run lint`      | Apenas type-check (sem emit)       |

---

## Histórico de commits sugerido

A ordem em que o projeto foi construído está refletida nos commits do repositório (use `git log --oneline` para ver):

1. `chore: scaffold monorepo with server + client`
2. `feat(server): bootstrap Express, TypeScript and Prisma schema`
3. `feat(server): JWT auth with bcrypt - register, login, me`
4. `feat(server): tasks CRUD with filtering, search and per-user stats`
5. `feat(server): centralized error handler and app entry`
6. `feat(client): scaffold Vite + React + Tailwind`
7. `feat(client): API client with token store and TanStack Query`
8. `feat(client): Auth and Theme contexts plus toast hook`
9. `feat(client): UI primitives (Button, Input, Modal, Toast)`
10. `feat(client): task hooks, components and dashboard widgets`
11. `feat(client): Login, Register and Dashboard pages with form validation`
12. `feat(client): wire routing, providers and protected routes`
13. `docs: write README with setup, architecture and API reference`

---

## Notas de produção

- **`JWT_SECRET`** precisa ser uma string aleatória longa (≥32 caracteres). O servidor recusa subir se for menor.
- O token é guardado em `localStorage` para simplicidade do portfólio. Em produção real, o ideal é trocar por **cookie httpOnly + proteção CSRF** ou um fluxo de **refresh tokens**.
- **CORS** é restrito ao valor de `CLIENT_ORIGIN`.
- Toda tarefa tem `userId` e qualquer leitura/escrita filtra ou valida posse antes de mexer.
- O `onDelete: Cascade` no Prisma garante que excluir um usuário apaga as tarefas dele.

---

## Licença

MIT — veja [LICENSE](./LICENSE).
