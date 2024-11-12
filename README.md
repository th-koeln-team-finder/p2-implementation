# Project Implementation Teamfinder

TODO Add description

## Setup

This project is divided into smaller packages, this section will run you through setting up all of them.

### Prerequisites

- Node.js (v22.11.0)
- pnpm (v9.12.3)
- Docker

### Development

Install node dependencies:

```bash
pnpm install
```

Run the services:

```bash
docker compose up -d reverse-proxy database file-storage
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

## Deployment
