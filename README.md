# TaskFlow

A full-stack task management app with authentication, priorities, due dates, search and a clean responsive UI with light/dark themes.

> Built as a portfolio project to demonstrate full-stack engineering: typed REST API, layered architecture, JWT auth, optimistic UI, and a polished design.

---

## Stack

**Backend** — Node.js · Express · TypeScript · Prisma · PostgreSQL · Zod · JWT · bcrypt
**Frontend** — React 18 · Vite · TypeScript · Tailwind CSS · TanStack Query · React Hook Form · React Router
**Tooling** — Docker Compose (optional) · ESM/CommonJS · pnpm/npm

---

## Features

- Email + password auth (JWT, bcrypt)
- Per-user task isolation enforced at the service layer
- Create, edit, delete, complete tasks
- Priority (Low / Medium / High) and optional due date
- Filter by status (all / pending / completed) and priority
- Full-text search by title (case-insensitive)
- Dashboard with totals: total / pending / completed / overdue
- Light & dark theme with system-preference detection
- Responsive layout (mobile → desktop)
- Toast notifications for success/error feedback
- Validated environment variables (fails fast on misconfig)
- Centralized error handler maps Zod / Prisma / app errors to clean JSON

---

## Architecture

```
TaskFlow/
├── server/                    REST API (Express + Prisma)
│   ├── prisma/schema.prisma
│   └── src/
│       ├── config/env.ts          → typed env validation (zod)
│       ├── lib/                    → prisma client, jwt helpers
│       ├── middleware/             → auth, error handler
│       ├── routes/                 → /auth, /tasks
│       ├── controllers/            → request → service → response
│       ├── services/               → business logic, ownership checks
│       ├── schemas/                → zod schemas (validation + types)
│       ├── app.ts                  → app factory
│       └── index.ts                → server bootstrap
└── client/                    React SPA (Vite + Tailwind)
    └── src/
        ├── contexts/               → Auth, Theme
        ├── lib/                    → api client, query client
        ├── hooks/                  → useTasks, useToast
        ├── components/
        │   ├── ui/                 → Button, Input, Modal, Toast
        │   ├── layout/             → Header
        │   ├── tasks/              → TaskCard, TaskList, TaskForm, TaskFilters
        │   └── dashboard/          → StatsCards
        ├── pages/                  → Login, Register, Dashboard
        └── App.tsx                 → routing + providers
```

Layered backend (`routes → controllers → services → prisma`) keeps HTTP concerns separate from business logic. The services layer owns ownership checks (`assertOwnership`) so every mutation route is automatically tenant-isolated.

---

## API

All `/api/tasks/*` routes require `Authorization: Bearer <token>`.

| Method | Path                 | Description                                    |
| ------ | -------------------- | ---------------------------------------------- |
| GET    | `/api/health`        | Health check                                   |
| POST   | `/api/auth/register` | Create user, returns `{ user, token }`         |
| POST   | `/api/auth/login`    | Authenticate, returns `{ user, token }`        |
| GET    | `/api/auth/me`       | Returns the authenticated user                 |
| GET    | `/api/tasks`         | List tasks (`?status=&search=&priority=`)      |
| GET    | `/api/tasks/stats`   | `{ total, pending, completed, overdue }`       |
| POST   | `/api/tasks`         | Create task                                    |
| PATCH  | `/api/tasks/:id`     | Update task (any subset of fields)             |
| DELETE | `/api/tasks/:id`     | Delete task                                    |

### Example

```bash
# register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada","email":"ada@example.com","password":"hunter2hunter2"}'

# create a task (token from the response above)
curl -X POST http://localhost:4000/api/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Ship portfolio","priority":"HIGH","dueDate":"2026-05-30T17:00:00.000Z"}'
```

---

## Getting started

### Prerequisites

- Node.js 20+
- A PostgreSQL database. Either:
  - **Docker** (easiest): `docker compose up -d`
  - **Cloud** (also free): paste a Neon / Supabase connection string into `server/.env`
  - **Local install** of Postgres 14+

### 1. Clone & install

```bash
git clone https://github.com/Lucas-Fermau/taskflow.git
cd taskflow

# install both packages
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment

```bash
# Backend
cp server/.env.example server/.env
# generate a JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# paste it into server/.env as JWT_SECRET

# Frontend
cp client/.env.example client/.env
```

### 3. Database

```bash
# Option A — Docker
docker compose up -d

# Option B — Neon / Supabase
# replace DATABASE_URL in server/.env with your connection string

# then run migrations
cd server
npm run prisma:migrate -- --name init
```

### 4. Run

```bash
# terminal 1 — API
cd server && npm run dev          # http://localhost:4000

# terminal 2 — frontend
cd client && npm run dev          # http://localhost:5173
```

Open http://localhost:5173, register, and start adding tasks.

---

## Scripts

### Server
| Script                | What it does                              |
| --------------------- | ----------------------------------------- |
| `npm run dev`         | Hot-reload server with `tsx`              |
| `npm run build`       | Compile TypeScript → `dist/`              |
| `npm start`           | Run compiled server                       |
| `npm run prisma:migrate` | Apply migrations in dev                |
| `npm run prisma:deploy`  | Apply migrations in prod                |
| `npm run prisma:studio`  | Open Prisma Studio                     |

### Client
| Script           | What it does                |
| ---------------- | --------------------------- |
| `npm run dev`    | Vite dev server             |
| `npm run build`  | Type-check + bundle         |
| `npm run preview`| Preview production build    |
| `npm run lint`   | Type-check only             |

---

## Suggested commit history

If you want to retrace the path the project took, here is the order it was built in:

1. `chore: scaffold monorepo with server + client`
2. `feat(server): set up Express + TypeScript + Prisma`
3. `feat(server): add validated env config with zod`
4. `feat(server): add User and Task Prisma models`
5. `feat(server): implement JWT signing/verification helpers`
6. `feat(server): add register/login/me endpoints with bcrypt`
7. `feat(server): add tasks CRUD with ownership checks`
8. `feat(server): add task filtering, search and stats`
9. `feat(server): centralize error handling (Zod + Prisma + HttpError)`
10. `chore: add docker-compose for local PostgreSQL`
11. `feat(client): scaffold Vite + React + Tailwind`
12. `feat(client): add API client with token store and ApiError`
13. `feat(client): add AuthContext + ThemeContext`
14. `feat(client): build Login and Register pages with validation`
15. `feat(client): build Dashboard with stats, filters and CRUD`
16. `feat(client): add light/dark theme toggle with persistence`
17. `feat(client): add toast notifications for user feedback`
18. `docs: write README, .env.example and contribution notes`

---

## Production notes

- `JWT_SECRET` must be a long random string (≥32 chars). The server refuses to boot otherwise.
- Tokens live in `localStorage` for portfolio simplicity. For production, move to httpOnly cookies + CSRF protection or a refresh-token rotation flow.
- CORS is restricted to `CLIENT_ORIGIN`.
- All tasks are owned by `userId` and every read/write filters or asserts ownership before mutating.
- Prisma's `onDelete: Cascade` on `Task.user` ensures user deletion cleans up tasks.

---

## License

MIT — see [LICENSE](./LICENSE).
