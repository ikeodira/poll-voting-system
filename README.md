# PollVote — Civic Engagement Poll & Voting System

A fullstack poll and voting platform built with **Angular** (frontend) and **NestJS** (backend), backed by **PostgreSQL**.

---

## Features

- JWT-based authentication with state selection (Nigerian states)
- Admin poll management (create, update, close, delete)
- One vote per user per poll (enforced at DB level)
- Results page with state-based filtering and visual progress bars
- Role-based access control (user / admin)
- User profile page

---

## Project Structure

```
poll-voting-system/
├── backend/          NestJS API
│   ├── src/
│   │   ├── auth/     Signup, login, JWT, guards
│   │   ├── polls/    Poll + option entities, CRUD
│   │   ├── votes/    Vote entity, cast + retrieve
│   │   └── users/    User entity, profile endpoint
│   └── .env.example
└── frontend/         Angular app
    └── src/app/
        ├── components/
        │   ├── auth/         Login, Signup
        │   ├── dashboard/    Poll listing
        │   ├── poll-detail/  View & vote
        │   ├── results/      Results + state filter
        │   ├── admin/        Admin panel (poll CRUD)
        │   ├── profile/      User profile
        │   └── shared/       Navbar
        ├── services/         AuthService, PollsService
        ├── guards/           authGuard, adminGuard
        └── interceptors/     JWT token interceptor
```

---

## Prerequisites

- **Node.js** v20+
- **PostgreSQL** (running locally)
- **npm** v9+

Install the CLIs:

```bash
npm install -g @nestjs/cli @angular/cli
```

---

## Setup

### 1. Create the PostgreSQL database

```bash
psql -U postgres
```

```sql
CREATE DATABASE poll_voting_db;
\q
```

### 2. Backend

```bash
cd backend
npm install

# Copy env file and fill in your credentials
cp .env.example .env
```

Edit `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=poll_voting_db
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
```

Start the backend:

```bash
npm run start:dev
```

API runs at: **http://localhost:3000/api**

> Tables are created automatically on first run (`synchronize: true`).

### 3. Frontend

```bash
cd frontend
npm install
ng serve
```

App runs at: **http://localhost:4200**

---

## Create your first admin user

1. Sign up normally through the app at `/signup`
2. Promote your account to admin via psql:

```sql
psql -U postgres -d poll_voting_db
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
\q
```

3. Log out and log back in — the Admin link will appear in the navbar.

---

## API Reference

### Auth
| Method | Endpoint | Body | Auth |
|--------|----------|------|------|
| POST | `/api/auth/signup` | `{ name, email, password, state }` | None |
| POST | `/api/auth/login` | `{ email, password }` | None |

### Polls
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/polls` | None |
| GET | `/api/polls/:id` | None |
| GET | `/api/polls/:id/results?state=Lagos` | None |
| POST | `/api/polls` | Admin JWT |
| PUT | `/api/polls/:id` | Admin JWT |
| DELETE | `/api/polls/:id` | Admin JWT |

### Votes
| Method | Endpoint | Body | Auth |
|--------|----------|------|------|
| POST | `/api/votes` | `{ pollId, optionId }` | JWT |
| GET | `/api/votes/poll/:pollId/my-vote` | — | JWT |

### Users
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/users/me` | JWT |

---

## Environment Variables

All backend environment variables are in `backend/.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USERNAME` | DB username | `postgres` |
| `DB_PASSWORD` | DB password | — |
| `DB_NAME` | Database name | `poll_voting_db` |
| `JWT_SECRET` | Secret key for signing JWTs | — |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |

---

## Database Schema

```
users         id, name, email, password, state, role, createdAt
polls         id, title, description, status, createdById, createdAt, updatedAt
poll_options  id, optionText, pollId
votes         id, userId, pollId, optionId, state, createdAt
              UNIQUE(userId, pollId)  ← prevents duplicate votes
```

---

## Troubleshooting

**Backend won't start**
- Check PostgreSQL is running: `pg_isready`
- Verify `.env` credentials match your PostgreSQL setup

**401 Unauthorized on API calls**
- Token might be expired — log out and log back in
- Check `JWT_SECRET` is set in `.env`

**Angular can't reach backend**
- Confirm backend is on port 3000
- Check `frontend/src/environments/environment.ts` has `apiUrl: 'http://localhost:3000/api'`

**CORS errors**
- Confirm `main.ts` in backend has `origin: 'http://localhost:4200'`
