# Project Implementation Teamfinder

TODO Add description

## Setup

This project is divided into smaller packages, this section will run you through setting up all of them.

### Prerequisites

- Node.js (v22.11.0)
- pnpm (v9.12.3)
- Docker

### Development

Copy all `.env.example` files to `.env.local`:

- `apps/frontend/.env.example` -> `apps/frontend/.env.local`
- `packages/database/.env.example` -> `packages/database/.env.local`

Install node dependencies:

```bash
pnpm install
```

Run the services:

```bash
docker compose up -d reverse-proxy database
```

Update your database with the latest schema changes:

> [!CAUTION]
> This could result in data loss, if you want to run the safer version of this command, use `pnpm db:migrate` instead.

```bash
pnpm db:push
```

Run the frontend locally:

```bash
pnpm dev
```

---

or to run the app in a single command:

```bash
docker compose up -d
```

---

You can now open the app in your browser at [collaborize.localhost](https://collaborize.localhost).

## Folder Structure

- `apps`: This contains all applications that will run separately in the end.
    - `frontend`: The NextJS frontend application
- `packages`: This contains all shared code between the applications.
    - `database`: The drizzle database configuration and connection for migrations
    - `design-system`: The React component library (uses shadcn/ui)
    - `env`: Typesafe environment variables for the applications
    - `tailwind-config`: The shared tailwind configuration for all applications
    - `typescript-config`: Different typescript configurations for the applications
- `biome.json`: The configuration file for the linter and formatter (biome)
- `Caddyfile`: The configuration file for the reverse proxy (Caddy) — This proxy is only used in local development
- `docker-compose.yml`: The configuration file for the docker services
- `pnpm-workspace.yaml`: The configuration file for the pnpm workspace
- `turbo.json`: The configuration file for the turbo mono-repo tool (contains the command configuration and caching instructions)

## Deployment

To migrate the database run

```bash
docker run --rm --network p2-implementation_web -v "$(pwd)":/app -w /app node:22-alpine sh -c "npm install -g pnpm && pnpm install && pnpm db:push"
```
