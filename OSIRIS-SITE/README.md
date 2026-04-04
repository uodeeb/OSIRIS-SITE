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

## Asset Management

Assets are stored in **Cloudflare R2** and served via database-resolved URLs.

### Quick Commands

```bash
# Verify asset health
npx tsx server/scripts/verify-assets.ts

# Seed database with R2 URLs
npx tsx server/inlineSeed.ts

# Migrate all assets to R2 format
npx tsx server/migrate-to-r2.ts
```

### Required Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Cloudflare R2
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=auto
S3_BUCKET_NAME=osiris-novel-assets
S3_ENDPOINT=https://your-account.r2.cloudflarestorage.com
```

### Documentation

- [Asset System Architecture](docs/ASSET_SYSTEM.md) - How the proxy system works
- [Asset Troubleshooting](docs/ASSET_TROUBLESHOOTING.md) - Debug common issues

## Useful Scripts

- `pnpm check`: TypeScript typecheck
- `pnpm test`: Server tests (Vitest)
- `pnpm db:push`: Generate + run Drizzle migrations (requires `DATABASE_URL`)
