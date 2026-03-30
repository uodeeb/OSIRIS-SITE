# OSIRIS-SITE

Interactive OSIRIS novel web app.

## Stack

- Client: React + Vite + Tailwind
- Server: Express + tRPC
- DB: Drizzle (MySQL)

## Prerequisites

- Node.js 22+
- Corepack enabled (for pnpm)

## Setup

1) Create an environment file:

- Copy `.env.example` to `.env`
- Fill values as needed

2) Install dependencies:

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

The server starts on port 3000 by default and serves the Vite client via middleware.

## Production

Build:

```bash
pnpm build
```

Run:

```bash
pnpm start
```

## Useful Scripts

- `pnpm check`: TypeScript typecheck
- `pnpm test`: Server tests (Vitest)
- `pnpm db:push`: Generate + run Drizzle migrations (requires `DATABASE_URL`)
