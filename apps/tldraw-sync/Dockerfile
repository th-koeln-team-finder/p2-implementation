FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN pnpm turbo run build --filter='tldraw-sync'

ENV PORT=5858
EXPOSE 5858

RUN cd ./apps/tldraw-sync

CMD [ "pnpm", "dev" ]